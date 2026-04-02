import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [userProfile, setUserProfile] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null);
			if (session?.user) {
				fetchUserProfile(session.user.id);
			} else {
				setLoading(false);
			}
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, session) => {
			console.log("Auth state changed:", _event, session?.user);
			setUser(session?.user ?? null);
			if (session?.user) {
				await fetchUserProfile(session.user.id);
			} else {
				setUserProfile(null);
				setLoading(false);
			}
		});

		return () => subscription.unsubscribe();
	}, []);

	const fetchUserProfile = async (userId) => {
		setLoading(true);
		try {
			const { data, error } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", userId)
				.single();

			if (error) {
				setUserProfile(null);
			} else {
				setUserProfile(data);
			}
		} catch (error) {
			setUserProfile(null);
		} finally {
			setLoading(false);
		}
	};

	const signUp = async (email, password, name, role) => {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
		});

		if (error) {
			if (error.message === "User already registered") {
				throw new Error("An account with this email already exists. Please log in instead.");
			}
			throw error;
		}

		if (data.user) {
			const status = role === "expert" ? 2 : 1;

			const { error: profileError } = await supabase
				.from("profiles")
				.upsert({
					id: data.user.id,
					name,
					email,
					role,
					status,
				}, { onConflict: 'id' });

			if (profileError) throw profileError;

			await fetchUserProfile(data.user.id);
		}

		return data;
	};

	const signIn = async (email, password) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) throw error;

		if (data.user) {
			await fetchUserProfile(data.user.id);
		}

		return data;
	};

	const signOut = async () => {
		console.log("AuthContext signOut called");
		
		// Try Supabase signOut with timeout
		const timeoutPromise = new Promise((_, reject) => 
			setTimeout(() => reject(new Error("signOut timeout")), 5000)
		);
		
		const signOutPromise = supabase.auth.signOut();
		
		try {
			await Promise.race([signOutPromise, timeoutPromise]);
		} catch (e) {
			console.log("Supabase signOut timed out or failed, clearing local session");
		}
		
		// Always clear local session regardless of server result
		setUser(null);
		setUserProfile(null);
		
		// Clear local storage
		localStorage.removeItem('supabase-auth-token');
		localStorage.removeItem('sb-kxyiocvswdwfiupekdjb-auth-token');
		
		console.log("Local session cleared");
	};

	const updateUserProfile = async (updates) => {
		if (!user) return;

		const { data, error } = await supabase
			.from("profiles")
			.update(updates)
			.eq("id", user.id)
			.select()
			.single();

		if (error) throw error;
		setUserProfile(data);
		return data;
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				userProfile,
				loading,
				signUp,
				signIn,
				signOut,
				updateUserProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
