import { GoogleLogin } from "@react-oauth/google";

export default function AuthViaGoogle() {
    return (
        <div className="google-button">
            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                    // credentialResponse.credential = ID token (JWT)
                    const idToken = credentialResponse.credential
                    console.log(idToken)
                    
        
                    const response = await fetch("/auth/google", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ token: idToken }),
                        credentials: "include", // Куки сессия
                    });
                    console.log(response)
                    
                    const data = await response.json()
                    console.log(data)
                }}
                onError={() => {
                    console.log("Login Failed")
                }}
            />
        </div>
    )
}