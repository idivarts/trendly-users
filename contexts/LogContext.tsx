import { createContext, useState } from "react";

interface ILogs {
    data: string[],
    pushData: (k: string) => any
}
const LogContext = createContext<ILogs>({ data: [], pushData: () => { } })

export const LogProvider: React.FC<{ children: any }> = ({ children }) => {
    const [data, setData] = useState<string[]>([])
    const pushData = (k: string) => {
        setData([...data, k])
    }
    return <LogContext.Provider value={{ data, pushData }}>
        {children}
    </LogContext.Provider>
}

export default LogContext