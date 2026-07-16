import { reactRouter } from "@react-router/dev/vite";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		tailwindcss(),
		reactRouter(),
		tsconfigPaths(),
	],
	resolve: {
		dedupe: ["react", "react-dom", "react-router"],
	},
	optimizeDeps: {
		include: ["@tanstack/react-table"],
	},
	ssr: {
		noExternal: ["@tanstack/react-table", "xlsx"],
	},
});
