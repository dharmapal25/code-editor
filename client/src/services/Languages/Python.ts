import api from "../api";

export const pythonCompiler = async (code: string) => {
    try {
        console.log("===== Python API =====");

        if (!code) {
            throw new Error("Code is empty");
        }

        const response = await api.post("/api/python/online-compiler", { code });
        return response.data;
    } catch (error) {
        console.error("Error in pythonCompiler:", error);
        throw error;
    }
};

