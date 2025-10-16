import GitHubProvider from "next-auth/providers/github";

// Handle CJS/ESM module interop
const GitHub = GitHubProvider.default ?? GitHubProvider;

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};