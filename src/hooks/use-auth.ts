"use client";
import { AuthProvider, useAuth as useFirebaseAuth } from "@/components/auth/auth-provider";

// This file is a simple re-export to match the requested file structure.
// The actual implementation is in `components/auth/auth-provider.tsx`.
export const useAuth = useFirebaseAuth;
