import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },

  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUsers = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (existingUsers?.length === 0) {
      const userData = {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
      };

      // Insert new user and capture the unique database ID
      const newUserId = await ctx.db.insert('UserTable', userData);
      
      return {
        _id: newUserId,
        ...userData
      };
    }

    // Return the matched user database details
    return existingUsers[0];
  },
});