// import * as React from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
//   TextField,
//   Button,
//   Box,
//   Typography,
//   BackdropProps,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// interface CombinedSignInPageProps {
//   open: boolean;
//   onClose: () => void;
// }

// const CombinedSignInPage: React.FC<CombinedSignInPageProps> = ({
//   open,
//   onClose,
// }) => {
//   const [email, setEmail] = React.useState("");
//   const [password, setPassword] = React.useState("");

//   const handleLogin = (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("Email:", email);
//     console.log("Password:", password);
//     // Handle login logic here
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md" // make dialog wider
//       fullWidth
//       BackdropProps={{
//         sx: {
//           backdropFilter: "blur(5px)", // blur background
//           backgroundColor: "rgba(0, 0, 0, 0.3)", // optional dim effect
//         },
//       }}
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           paddingX: 2,
//           paddingY: 1,
//         },
//       }}
//     >
//       <DialogTitle>
//         Sign In
//         <IconButton
//           aria-label="close"
//           onClick={onClose}
//           sx={{ position: "absolute", right: 8, top: 8 }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent>
//         <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
//           <Typography variant="body1" mb={1}>
//             Welcome back! Please sign in.
//           </Typography>
//           <TextField
//             fullWidth
//             label="Email"
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             margin="normal"
//             required
//           />
//           <TextField
//             fullWidth
//             label="Password"
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             margin="normal"
//             required
//           />
//           <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
//             Sign In
//           </Button>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CombinedSignInPage;

import * as React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const Transition = React.forwardRef(function Transition(props: any, ref: any) {
  return <Slide direction="down" ref={ref} {...props} />;
});

interface CombinedSignInPageProps {
  open: boolean;
  onClose: () => void;
}

const CombinedSignInPage: React.FC<CombinedSignInPageProps> = ({
  open,
  onClose,
}) => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // const handleLogin = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");

  //   if (!email.includes("@")) {
  //     setError("Please enter a valid email address.");
  //     return;
  //   }

  //   if (password.length < 6) {
  //     setError("Password must be at least 6 characters.");
  //     return;
  //   }

  //   // Placeholder for login logic
  //   console.log("Email:", email);
  //   console.log("Password:", password);
  //   onClose(); // Close after success (replace with actual login result)
  // };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
  
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
  
    try {
      console.log("Attempting login with email:", email);

      const loginResponse = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }), 
      });
  
      if (!loginResponse.ok) {
        const data = await loginResponse.json();
        console.error("Login failed:", data.detail || "Unknown Error");
        setError(data?.detail || data?.email?.[0] || "Login failed.");
        return;
      }
  
      const data = await loginResponse.json();
      const accessToken = data.access;
      const refreshToken = data.refresh;

    // Now fetch user details to get designation
    const userInfoRes = await fetch("http://127.0.0.1:8000/api/users/me/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoRes.ok) {
      console.error("Failed to fetch user info.");
      setError("Login succeeded, but failed to fetch user info.");
      return;
    }

    const userInfo = await userInfoRes.json();
    const { designation, username } = userInfo;
  
      //  Save tokens and user info
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      localStorage.setItem("designation",designation); 
      localStorage.setItem("username",username);
      localStorage.setItem("email", email);
  
      window.dispatchEvent(new Event("storage"));

      console.log(`✅ ${designation.toUpperCase()} '${username}' logged in successfully.`);
      console.log("Access Token stored in localStorage.");
      console.log("Redirecting to Home Page...");

      // Close modal
      onClose();
  
      // Redirect or update state (you can route to dashboard)
      // window.location.href = "/"; 
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Transition}
      BackdropProps={{
        sx: {
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          px: 3,
          py: 2,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.5rem" }}>
        Sign In
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
          <Typography variant="body1" mb={2}>
            Welcome back! Please sign in.
          </Typography>

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.5, fontWeight: "bold", borderRadius: 2 }}
          >
             {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CombinedSignInPage;
