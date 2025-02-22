import { useEffect } from "react";
import { socket } from "../socket";

const Admin = () => {

    useEffect(() => {
        socket.on("connect", () => {
            console.log("connection successful");
            
            socket.emit("joinAdmin", {
                password: "1234"
            })
            
        })

        return () => {
            socket.off("connect", () => {
                console.log("User disconnected successfully");
            });
        }
    }, []);

    return (
        <div>Admin</div>
    )
}

export default Admin;