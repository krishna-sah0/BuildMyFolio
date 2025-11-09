export interface PersonalDetails {
    name: string;
    title: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    summary: string;
    leetcode?: string;
    hackerrank?: string;
    resumeUrl?: string;
    profilePictureUrl?: string;
}

export interface Education {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    description: string;
}

export interface WorkExperience {
    company: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    responsibilities: string[];
}

export interface Skill {
    category: string;
    name: string;
    level: number; // Proficiency level from 0 to 100
}

export interface Project {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    imageUrl?: string;
}

export interface Achievement {
    title: string;
    description: string;
}

export interface Certification {
    name: string;
    issuingOrganization: string;
    date: string;
    credentialUrl?: string;
}

export interface SEO {
    title: string;
    description: string;
}

export interface ContactMessage {
    name: string;
    email: string;
    message: string;
    date: string;
}

export interface PortfolioData {
    personalDetails: PersonalDetails;
    education: Education[];
    workExperience: WorkExperience[];
    skills: Skill[];
    projects: Project[];
    achievements: Achievement[];
    certifications: Certification[];
    seo: SEO;
}