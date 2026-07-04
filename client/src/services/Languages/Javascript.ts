import api from "../api";

export const javascriptCompiler = async (code: string) => {
    try {

        if (!code) {
            throw new Error("Code is empty");
        }

        const response = await api.post("/javascript/online-compiler", { code });
        return response;
    } catch (error) {
        console.error("Error in javascriptCompiler:", error);
    }
};

