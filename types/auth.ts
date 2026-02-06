
export interface Session {
  user: {
    id: string;
    name: string;
    role: 'ADMIN' | 'OPERATOR' | 'CLIENT';
  };
  expires: string;
}
