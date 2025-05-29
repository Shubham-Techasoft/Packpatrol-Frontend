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
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// interface CombinedSignUpPageProps {
//   open: boolean;
//   onClose: () => void;
// }

// const CombinedSignUpPage: React.FC<CombinedSignUpPageProps> = ({
//   open,
//   onClose,
// }) => {
//   const [fullName, setFullName] = React.useState("");
//   const [email, setEmail] = React.useState("");
//   const [password, setPassword] = React.useState("");
//   const [confirmPassword, setConfirmPassword] = React.useState("");
//   const [error, setError] = React.useState("");

//   const handleSignUp = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     // Placeholder logic - replace with actual backend API
//     setTimeout(() => {
//       console.log(`Sign up: ${fullName}, ${email}`);
//       if (!email.includes("@")) {
//         setError("Invalid email format.");
//       } else {
//         alert("Signup successful!");
//         onClose();
//       }
//     }, 500);
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth="md"
//       BackdropProps={{
//         sx: {
//           backdropFilter: "blur(5px)",
//           backgroundColor: "rgba(0, 0, 0, 0.3)",
//         },
//       }}
//       PaperProps={{
//         sx: {
//           borderRadius: 3,
//           px: 2,
//           py: 1,
//         },
//       }}
//     >
//       <DialogTitle>
//         Sign Up
//         <IconButton
//           aria-label="close"
//           onClick={onClose}
//           sx={{ position: "absolute", right: 8, top: 8 }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent>
//         <Box component="form" onSubmit={handleSignUp} sx={{ mt: 2 }}>
//           <Typography variant="body1" mb={1}>
//             Create your account
//           </Typography>

//           <TextField
//             fullWidth
//             label="Full Name"
//             value={fullName}
//             onChange={(e) => setFullName(e.target.value)}
//             margin="normal"
//             required
//           />
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
//           <TextField
//             fullWidth
//             label="Re-enter Password"
//             type="password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             margin="normal"
//             required
//           />

//           {error && (
//             <Typography color="error" mt={1}>
//               {error}
//             </Typography>
//           )}

//           <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
//             Sign Up
//           </Button>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CombinedSignUpPage;

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

interface CombinedSignUpPageProps {
  open: boolean;
  onClose: () => void;
}

const CombinedSignUpPage: React.FC<CombinedSignUpPageProps> = ({
  open,
  onClose,
}) => {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (fullName.trim().length < 3) {
      setError("Full name must be at least 3 characters.");
      return;
    }

    if (!email.includes("@")) {
      setError("Invalid email format.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Placeholder logic - replace with actual backend API
    setTimeout(() => {
      alert("Signup successful!");
      onClose();
    }, 500);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
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
        Sign Up
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSignUp} sx={{ mt: 2 }}>
          <Typography variant="body1" mb={2}>
            Create your account
          </Typography>

          <TextField
            fullWidth
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            margin="normal"
            required
            inputProps={{ minLength: 3 }}
          />
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
          <TextField
            fullWidth
            label="Re-enter Password"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
            Sign Up
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CombinedSignUpPage;
