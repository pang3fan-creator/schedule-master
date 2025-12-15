"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface SubscriptionState {
    plan: string;
    isPro: boolean;
    isLoading: boolean;
    customerId: string | null;
    expiresAt: string | null;
    status: string;
    refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionState>({
    plan: "free",
    isPro: false,
    isLoading: true,
    customerId: null,
    expiresAt: null,
    status: "active",
    refresh: async () => { },
});

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<Omit<SubscriptionState, "refresh">>({
        plan: "free",
        isPro: false,
        isLoading: true,
        customerId: null,
        expiresAt: null,
        status: "active",
    });

    const fetchSubscription = useCallback(async () => {
        try {
            const res = await fetch("/api/subscription");
            if (res.ok) {
                const data = await res.json();
                setState({
                    plan: data.plan,
                    isPro: data.plan !== "free" && data.status === "active",
                    isLoading: false,
                    customerId: data.customerId,
                    expiresAt: data.expiresAt,
                    status: data.status,
                });
            } else {
                setState((prev) => ({ ...prev, isLoading: false }));
            }
        } catch {
            setState((prev) => ({ ...prev, isLoading: false }));
        }
    }, []);

    useEffect(() => {
        fetchSubscription();
    }, [fetchSubscription]);

    return (
        <SubscriptionContext.Provider value={{ ...state, refresh: fetchSubscription }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export const useSubscription = () => useContext(SubscriptionContext);
