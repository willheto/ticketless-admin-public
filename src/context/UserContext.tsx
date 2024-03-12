import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useEffect,
} from 'react';

type UserContextType = {
	user: UserInterface | null;
	setUser: (user: UserInterface | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error('useUser must be used within a UserProvider');
	}
	return context;
};

type UserProviderProps = {
	defaultUser: UserInterface | null;
	children: ReactNode;
};

export const UserProvider: React.FC<UserProviderProps> = ({
	defaultUser,
	children,
}) => {
	const [user, setUser] = useState<UserInterface | null>(null);

	useEffect(() => {
		setUser(defaultUser);
	}, [defaultUser]);

	const contextValue: UserContextType = {
		user,
		setUser,
	};

	return (
		<UserContext.Provider value={contextValue}>
			{children}
		</UserContext.Provider>
	);
};
