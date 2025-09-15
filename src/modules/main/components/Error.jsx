import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";

const Error = () => {
    return (
        <Box
            sx={{
                height: "100vh",             // full height
                width: "100vw",
                display: "flex",
                justifyContent: "center",    // horizontal center
                alignItems: "center",        // vertical center
                flexDirection: "column",
                textAlign: "center",
                gap: 2,
            }}
        >
            <Typography variant="h2" color="error">
                404
            </Typography>
            <Typography variant="h5">
                Oops! Page Not Found
            </Typography>
            <Typography variant="body1">
                The page you are looking for does not exist.
            </Typography>
            <Button
                component={Link}
                to="/"
                sx={{
                    mt: 2,
                    backgroundColor: "black",
                    color: "white",
                    "&:hover": { backgroundColor: "#333" },
                }}
            >
                Go to Home
            </Button>
        </Box>
    );
};

export default Error;
