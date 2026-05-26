import { useState, useEffect } from "react";
import {
	Box,
	Heading,
	Text,
	Spinner,
	Button,
	Input,
	SimpleGrid,
	Flex,
	Image,
	Tabs,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../library/supabase/supabaseClient";
import { toaster } from "../../library/toaster";
import backArrow from "../../assets/Login/back_arrow.svg";
import amountsAssets from "../../assets/Admin/amounts_assets.svg";
import "../../ui/login.css";
import "../../ui/admin.css";
import "../../components/profile/profile.css";

const statusLabels = {
	1: "Active",
	2: "Pending",
	3: "Verified",
	4: "Declined",
};

const statusColors = {
	1: "#6e8f85",
	2: "#c27a6b",
	3: "#0C4767",
	4: "#a1a1aa",
};

function Admin() {
	const navigate = useNavigate();
	const [adminUser, setAdminUser] = useState(null);
	const [checking, setChecking] = useState(true);
	const [email, setEmail] = useState("admin@mindly.com");
	const [password, setPassword] = useState("");
	const [authLoading, setAuthLoading] = useState(false);
	const [authError, setAuthError] = useState("");

	const [stats, setStats] = useState({ users: 0, experts: 0, posts: 0, reports: 0 });
	const [reports, setReports] = useState([]);
	const [loadingData, setLoadingData] = useState(true);
	const [confirmModal, setConfirmModal] = useState({ open: false, action: null, postId: null, postBody: "" });
	const [activeTab, setActiveTab] = useState("users");

	const [allUsers, setAllUsers] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(false);

	useEffect(() => {
		checkAdminSession();
	}, []);

	useEffect(() => {
		if (adminUser) {
			fetchDashboardData();
			fetchAllUsers();
		}
	}, [adminUser]);

	const fetchDashboardData = async () => {
		setLoadingData(true);
		try {
			const [{ count: users }, { count: experts }, { count: posts }, { data: reportsData }] = await Promise.all([
				supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "user"),
				supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "expert"),
				supabase.from("posts").select("id", { count: "exact", head: true }),
				supabase.from("reports").select("*"),
			]);

			const reporterIds = [...new Set((reportsData || []).map((r) => r.reported_by).filter(Boolean))];
			const postIds = [...new Set((reportsData || []).map((r) => r.post_id).filter(Boolean))];

			const [profilesResult, postsResult] = await Promise.all([
				reporterIds.length > 0
					? supabase.from("profiles").select("id, name").in("id", reporterIds)
					: { data: [] },
				postIds.length > 0
					? supabase.from("posts").select("id, body, user_id").in("id", postIds)
					: { data: [] },
			]);

			const profileMap = {};
			(profilesResult.data || []).forEach((p) => { profileMap[p.id] = p.name; });

			const postMap = {};
			const postCreatorIds = [];
			(postsResult.data || []).forEach((p) => {
				postMap[p.id] = { body: p.body, user_id: p.user_id };
				if (p.user_id) postCreatorIds.push(p.user_id);
			});

			const { data: creatorProfiles } = postCreatorIds.length > 0
				? await supabase.from("profiles").select("id, name").in("id", [...new Set(postCreatorIds)])
				: { data: [] };

			const creatorMap = {};
			(creatorProfiles || []).forEach((p) => { creatorMap[p.id] = p.name; });

			const enriched = (reportsData || []).map((r) => {
				const post = postMap[r.post_id] || {};
				return {
					...r,
					reporter_name: profileMap[r.reported_by] || "Unknown",
					post_body: post.body || "Post deleted",
					post_creator_name: creatorMap[post.user_id] || "Unknown",
				};
			});

			setStats({ users: users || 0, experts: experts || 0, posts: posts || 0, reports: enriched.length });
			setReports(enriched);
		} catch (err) {
			console.error("Error fetching dashboard data:", err);
		} finally {
			setLoadingData(false);
		}
	};

	const fetchAllUsers = async () => {
		setLoadingUsers(true);
		try {
			const { data: profiles, error } = await supabase
				.from("profiles")
				.select("*");

			if (error) throw error;

			setAllUsers(profiles || []);
		} catch (err) {
			console.error("Error fetching users:", err);
		} finally {
			setLoadingUsers(false);
		}
	};

	const handleApproveExpert = async (userId) => {
		const { error } = await supabase
			.from("profiles")
			.update({ status: 3 })
			.eq("id", userId);

		if (error) {
			toaster.create({ title: "Error", description: "Failed to approve expert.", type: "error" });
			return;
		}

		setAllUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 3 } : u)));
		toaster.create({ title: "Expert approved", description: "The expert can now log in.", type: "success" });
	};

	const handleDeclineExpert = async (userId) => {
		const { error } = await supabase
			.from("profiles")
			.update({ status: 4 })
			.eq("id", userId);

		if (error) {
			toaster.create({ title: "Error", description: "Failed to decline expert.", type: "error" });
			return;
		}

		setAllUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, status: 4 } : u)));
		toaster.create({ title: "Expert declined", description: "The expert account has been declined.", type: "info" });
	};

	const handleDismissReport = async (postId) => {
		const { error } = await supabase.from("reports").delete().eq("post_id", postId);
		if (error) {
			toaster.create({ title: "Error", description: "Failed to dismiss reports.", type: "error" });
			return;
		}
		setReports((prev) => prev.filter((r) => r.post_id !== postId));
		setStats((prev) => ({ ...prev, reports: prev.reports - 1 }));
		toaster.create({ title: "Reports dismissed", type: "success" });
	};

	const handleDeletePost = async (postId) => {
		const { error: deleteReports } = await supabase.from("reports").delete().eq("post_id", postId);
		if (deleteReports) {
			toaster.create({ title: "Error", description: "Failed to delete reports.", type: "error" });
			return;
		}
		await supabase.from("likes").delete().eq("post_id", postId);
		await supabase.from("replies").delete().eq("post_id", postId);
		const { error: deletePost } = await supabase.from("posts").delete().eq("id", postId);
		if (deletePost) {
			toaster.create({ title: "Error", description: "Failed to delete post.", type: "error" });
			return;
		}
		setReports((prev) => prev.filter((r) => r.post_id !== postId));
		setStats((prev) => ({ ...prev, reports: prev.reports - 1, posts: prev.posts - 1 }));
		toaster.create({ title: "Post deleted", type: "success" });
	};

	const openConfirmModal = (action, postId, postBody) => {
		setConfirmModal({ open: true, action, postId, postBody });
	};

	const handleConfirmAction = async () => {
		const { action, postId } = confirmModal;
		setConfirmModal({ open: false, action: null, postId: null, postBody: "" });
		if (action === "keep") {
			await handleDismissReport(postId);
		} else if (action === "delete") {
			await handleDeletePost(postId);
		}
	};

	const checkAdminSession = async () => {
		setChecking(true);
		const { data: { session } } = await supabase.auth.getSession();
		if (session?.user) {
			const { data: profile } = await supabase
				.from("profiles")
				.select("role")
				.eq("id", session.user.id)
				.single();
			if (profile?.role === "admin") {
				setAdminUser(session.user);
			} else {
				await supabase.auth.signOut();
			}
		}
		setChecking(false);
	};

	const handleAdminLogin = async (e) => {
		e.preventDefault();
		setAuthLoading(true);
		setAuthError("");
		try {
			const { data, error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) throw error;
			const { data: profile } = await supabase
				.from("profiles")
				.select("role, name")
				.eq("id", data.user.id)
				.single();
			if (profile?.role === "admin") {
				setAdminUser(data.user);
				toaster.create({
					title: "Welcome Admin",
					description: `Logged in as ${profile.name || "Admin"}`,
					type: "success",
				});
			} else {
				await supabase.auth.signOut();
				setAuthError("This account does not have admin access.");
			}
		} catch (err) {
			setAuthError(err.message);
		} finally {
			setAuthLoading(false);
		}
	};

	const handleAdminLogout = async () => {
		await supabase.auth.signOut();
		setAdminUser(null);
		navigate("/");
	};

	const reasonLabels = {
		inappropriate_language: "Inappropriate language",
		personal_information: "Personal information",
		harassment: "Harassment",
		spam: "Spam",
		other: "Other",
	};

	if (checking) {
		return (
			<Box className="admin-page">
				<Box className="admin-spinner">
					<Spinner size="xl" color="#472c1b" />
				</Box>
			</Box>
		);
	}

	if (!adminUser) {
		return (
			<Box className="login-page">
				<Box className="login-container">
					<Box as="button" className="back-arrow" onClick={() => navigate("/")}>
						<Box as="img" src={backArrow} alt="Back" />
					</Box>

					<Box className="login-card">
						<Text className="login-subtitle">Admin Login</Text>
						{authError && (
							<Text color="red.500" mb={4} fontSize="sm">
								{authError}
							</Text>
						)}
						<form onSubmit={handleAdminLogin}>
							<Box width="100%" mb={4}>
								<Text className="input-label">Email</Text>
								<Input
									type="email"
									placeholder="admin@mindly.com"
									className="login-input"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</Box>
							<Box width="100%" mb={4}>
								<Text className="input-label">Password</Text>
								<Input
									type="password"
									placeholder="Enter your password"
									className="login-input"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
								/>
							</Box>
							<Button
								type="submit"
								className="login-button"
								disabled={authLoading}
							>
								{authLoading ? "Signing in..." : "Sign in"}
							</Button>
						</form>
					</Box>
				</Box>
			</Box>
		);
	}

	return (
		<Box className="admin-page">
			<Box className="admin-container">
				<Box className="admin-header">
					<Heading className="admin-heading">
						Admin Dashboard
					</Heading>
					<Button onClick={handleAdminLogout} className="btn-logout">
						Log out
					</Button>
				</Box>

				{loadingData ? (
					<Flex justify="center" py={10}>
						<Spinner size="xl" color="#472c1b" />
					</Flex>
				) : (
					<SimpleGrid columns={{ base: 2, md: 4 }} gap={6} mb={10}>
						<Box className="stat-card">
							<Box p={4} pb={6}>
								<Text className="stat-number">{stats.users}</Text>
							</Box>
							<Box position="relative">
								<Image src={amountsAssets} alt="" w="100%" />
								<Text className="stat-label-box">Users</Text>
							</Box>
						</Box>
						<Box className="stat-card">
							<Box p={4} pb={6}>
								<Text className="stat-number">{stats.experts}</Text>
							</Box>
							<Box position="relative">
								<Image src={amountsAssets} alt="" w="100%" />
								<Text className="stat-label-box">Experts</Text>
							</Box>
						</Box>
						<Box className="stat-card">
							<Box p={4} pb={6}>
								<Text className="stat-number">{stats.posts}</Text>
							</Box>
							<Box position="relative">
								<Image src={amountsAssets} alt="" w="100%" />
								<Text className="stat-label-box">Posts</Text>
							</Box>
						</Box>
						<Box className="stat-card">
							<Box p={4} pb={6}>
								<Text className="stat-number">{stats.reports}</Text>
							</Box>
							<Box position="relative">
								<Image src={amountsAssets} alt="" w="100%" />
								<Text className="stat-label-box">Reports</Text>
							</Box>
						</Box>
					</SimpleGrid>
				)}

				<Box className="profile-tabs-wrapper">
					<Tabs.Root
						value={activeTab}
						onValueChange={(details) => setActiveTab(details.value)}
					>
						<Tabs.List className="profile-tab-list">
							<Tabs.Trigger value="users" className="profile-tab-trigger">
								Users
							</Tabs.Trigger>
							<Tabs.Trigger value="reports" className="profile-tab-trigger">
								Reports
							</Tabs.Trigger>
						</Tabs.List>

						<Tabs.Content value="users" className="profile-tab-content">
							{loadingUsers ? (
								<Flex justify="center" py={10}>
									<Spinner size="xl" color="#472c1b" />
								</Flex>
							) : allUsers.length === 0 ? (
								<Text className="reports-empty">No users found.</Text>
							) : (
								<Box className="admin-users-table-wrapper">
									<table className="admin-users-table">
										<thead>
											<tr>
												<th>Name</th>
												<th>Email</th>
												<th>Role</th>
												<th>Status</th>
												<th>Actions</th>
											</tr>
										</thead>
										<tbody>
											{allUsers.map((u) => (
												<tr key={u.id}>
													<td className="admin-user-name">{u.name || "—"}</td>
													<td>{u.email || "—"}</td>
													<td>
														<Text
															as="span"
															className="admin-role-badge"
															bg={u.role === "admin" ? "#0C4767" : u.role === "expert" ? "#6e8f85" : "#c27a6b"}
														>
															{u.role}
														</Text>
													</td>
													<td>
														<Text
															as="span"
															className="admin-status-badge"
															bg={statusColors[u.status] || "#a1a1aa"}
														>
															{statusLabels[u.status] || "Unknown"}
														</Text>
													</td>
													<td>
														{u.role === "expert" && u.status === 2 ? (
															<Flex gap={2} wrap="wrap">
																{u.verification_doc ? (
																	<Button
																		as="a"
																		href={u.verification_doc}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="admin-btn-view"
																	>
																		View Document
																	</Button>
																) : (
																	<Text fontSize="sm" color="#a1a1aa" fontStyle="italic">
																		No document
																	</Text>
																)}
																<Button
																	className="admin-btn-approve"
																	onClick={() => handleApproveExpert(u.id)}
																>
																	Approve
																</Button>
																<Button
																	className="admin-btn-decline"
																	onClick={() => handleDeclineExpert(u.id)}
																>
																	Decline
																</Button>
															</Flex>
														) : (
															<Text fontSize="sm" color="#a1a1aa" fontStyle="italic">
																—
															</Text>
														)}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</Box>
							)}
						</Tabs.Content>

						<Tabs.Content value="reports" className="profile-tab-content">
							<Box className="reports-section">
								{reports.length === 0 ? (
									<Text className="reports-empty">No reports to review.</Text>
								) : (
									reports.map((report) => {
										const uniqueKey = `${report.post_id}-${report.reported_by}`;
										return (
											<Box key={uniqueKey} bg="#fefae0" border="2px solid" borderColor="#472c1b" borderRadius="12px" p={5} mb={4} boxShadow="lg">
												<Flex justify="space-between" align="center" mb={3} gap={4}>
													<Text color="#472c1b" fontSize="1.75rem" fontWeight="500">
														{report.reporter_name}
													</Text>
													<Text bg="#472c1b" color="#fefae0" px={3} py={1} borderRadius="full" fontSize="0.8rem" fontWeight="bold" flexShrink={0}>
														{reasonLabels[report.reason] || report.reason}
													</Text>
												</Flex>
												{report.description && (
													<Text color="#8a7a6a" fontSize="0.9rem" mb={3} pl={1}>
														<Text as="span" fontWeight="bold" color="#472c1b">Detail: </Text>
														{report.description}
													</Text>
												)}
												<Box h="1px" bg="#e0d5c1" my={3} />
												<Text color="#472c1b" fontSize="0.95rem" mb={1}>
													<Text as="span" fontWeight="bold">Post creator: </Text>
													{report.post_creator_name}
												</Text>
												<Text color="#472c1b" bg="rgba(71,44,27,0.05)" px={3} py={2} borderRadius="8px">
													<Text as="span" fontWeight="bold">Post: </Text>
													{report.post_body}
												</Text>
												<Flex gap={3} mt={4}>
													<Button
														className="btn-keep"
														onClick={() => openConfirmModal("keep", report.post_id, report.post_body)}
													>
														Keep
													</Button>
													<Button
														className="btn-delete"
														onClick={() => openConfirmModal("delete", report.post_id, report.post_body)}
													>
														Delete
													</Button>
												</Flex>
											</Box>
										);
									})
								)}
							</Box>
						</Tabs.Content>
					</Tabs.Root>
				</Box>
			</Box>

			{confirmModal.open && (
				<Box
					position="fixed"
					top="0"
					left="0"
					right="0"
					bottom="0"
					bg="rgba(0,0,0,0.5)"
					display="flex"
					alignItems="center"
					justifyContent="center"
					zIndex="9999"
				>
					<Box bg="#fefae0" p={6} borderRadius="12px" maxW="500px" width="90%">
						<Heading fontSize="22px" color="#472c1b" mb={3}>
							{confirmModal.action === "delete" ? "Delete this post?" : "Dismiss these reports?"}
						</Heading>
						<Text color="#472c1b" mb={2}>
							{confirmModal.action === "delete"
								? "This will permanently delete the post and all associated reports, likes, and replies."
								: "This will dismiss all reports for this post. The post will remain."}
						</Text>
						<Box bg="#f5f0d7" p={3} borderRadius="8px" mb={4}>
							<Text color="#472c1b" fontStyle="italic">"{confirmModal.postBody}"</Text>
						</Box>
						<Flex gap={3} justify="flex-end">
							<Button
								bg="gray.400"
								color="white"
								fontWeight="bold"
								px={4}
								py={2}
								borderRadius="8px"
								border="none"
								cursor="pointer"
								onClick={() => setConfirmModal({ open: false, action: null, postId: null, postBody: "" })}
							>
								Cancel
							</Button>
							<Button
								className={confirmModal.action === "delete" ? "btn-delete" : "btn-keep"}
								onClick={handleConfirmAction}
							>
								{confirmModal.action === "delete" ? "Delete" : "Keep"}
							</Button>
						</Flex>
					</Box>
				</Box>
			)}
		</Box>
	);
}

export default Admin;
