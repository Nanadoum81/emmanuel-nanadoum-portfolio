import type { Metadata } from 'next';
export const metadata: Metadata = {title:'KnowledgeOS Workspace',robots:{index:false,follow:false},alternates:{canonical:'/knowledgeos/workspace'}};
export default function WorkspaceLayout({children}:{children:React.ReactNode}) {return children;}
