import api from "../api";

export const javascriptCompiler = async (code: string) => {
    try {
        console.log("===== JS API =====");

        if (!code) {
            throw new Error("Code is empty");
        }

        const response = await api.post("/api/javascript/online-compiler", { code });
        return response.data;
    } catch (error) {
        console.error("Error in javascriptCompiler:", error);
        throw error;
    }
};

