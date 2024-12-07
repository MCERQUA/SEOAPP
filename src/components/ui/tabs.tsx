import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  const contextValue = React.useMemo(
    () => ({ value, onValueChange }),
    [value, onValueChange]
  );

  return (
    <div className="w-full">
      {children}
    </div>
  );
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`flex ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  const context = React.useContext(
    React.createContext({ value: '', onValueChange: (v: string) => {} })
  );

  return (
    <button
      onClick={() => context.onValueChange(value)}
      className={className}
      role="tab"
      aria-selected={context.value === value}
      tabIndex={0}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: TabsContentProps) {
  const context = React.useContext(
    React.createContext({ value: '' })
  );

  if (context.value !== value) {
    return null;
  }

  return <div>{children}</div>;
}