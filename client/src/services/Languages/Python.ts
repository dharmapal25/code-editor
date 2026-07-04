import api from "../api";

export const pythonCompiler = async (code: string) => {
    try {

        if (!code) {
            throw new Error("Code is empty");
        }

        const response = await api.post("/python/online-compiler", { code });
        return response;
    } catch (error) {
        console.error("Error in pythonCompiler:", error);
    }
};

