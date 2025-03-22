import axios from "axios";

const API_BASE_URL = "http://localhost:9999/api/posts";

const BEARER_TOKEN =
<<<<<<< HEAD
    "";
=======
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyMDEiLCJpYXQiOjE3NDIyODIxMTgsImV4cCI6MTc0MjI4MzkxOH0.ZEN-pyOMFYJy4ubSZcexF85txxDmszYE1_GPQvvAl-o";
>>>>>>> eaf1c23dca1a4d83f31ec2966cc8e46e4db941a1

export const getPosts = async () => {
    try {
        const response = await axios.get("http://localhost:9999/api/posts", {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Lỗi khi lấy bài viết:", error);
    }
};

export const getww = async () => {
    try {
        const response = await axios.get(
            "http://localhost:9999/api/auth/welcome"
        );
        return response;
    } catch (error) {
        console.error("Lỗi khi lxxxxviết:", error);
        throw error;
    }
};

export const createPost = async (postData: {
    title: string;
    content: string;
}) => {
    try {
        const response = await axios.post(API_BASE_URL, postData, {
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo bài viết:", error);
        throw error;
    }
};
