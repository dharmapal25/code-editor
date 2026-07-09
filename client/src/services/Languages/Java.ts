import api from "../api";

export const javaCompiler = async (code: string) => {
    try {
        console.log("===== Java API =====");

        if (!code) {
            throw new Error("Code is empty");
        }

        const response = await api.post("/api/java/online-compiler", { code });
        return response.data;
    } catch (error) {
        console.error("Error in javaCompiler:", error);
        throw error;
    }
};
