import { RegisterFormData } from "./pages/Register";
import { SigInFormData } from "./pages/SignIn";

//Importing .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const register = async (formData: RegisterFormData) => {
	const res = await fetch(`${API_BASE_URL}/api/users/register`, {
		method: "POST",
		credentials: "include", //set cookies to the browser
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	});

	const resData = await res.json();

	if (!res.ok) {
		throw new Error(resData.message);
	}
};

export const signIn = async (formData: SigInFormData)=> {

    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
		method: "POST",
		credentials: "include", //set cookies to the browser
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(formData),
	});

    const resData = await res.json();

	if (!res.ok) {
		throw new Error("Invalid Credentials");
	}

    return resData;
}

export const signOut = async () => {
    const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        credentials: "include",
		method: "POST",
    })

    if(!res.ok){
        throw new Error("Error during sign out")
    }

}


export const validateToken = async () => {
	const res = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
		credentials: "include",
        
	});

    if(!res.ok){
        throw new Error("Token Invalid")
    }

    return res.json()
};
