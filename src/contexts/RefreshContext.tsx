import { createContext, useContext, useState } from "react";

// Tạo Context
const RefreshContext = createContext<{
	refreshTrigger: number;
	refresh: () => void;
} | null>(null);

// Provider để bọc toàn bộ ứng dụng
export const RefreshProvider = ({ children }: { children: React.ReactNode }) => {
	const [refreshTrigger, setRefreshTrigger] = useState(0);

	// Hàm để trigger refresh
	const refresh = () => {
		setRefreshTrigger((prev) => prev + 1);
	};

	return (
		<RefreshContext.Provider value={{ refreshTrigger, refresh }}>
			{children}
		</RefreshContext.Provider>
	);
};

// Hook để dễ dàng sử dụng trong component
export const useRefresh = () => {
	const context = useContext(RefreshContext);
	if (!context) {
		throw new Error("useRefresh phải được sử dụng bên trong RefreshProvider");
	}
	return context;
};
