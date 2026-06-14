import api from './api';

const portfolioService = {
  // Profile
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },

  // Skills
  getSkills: async () => {
    const response = await api.get('/skills');
    return response.data;
  },
  addSkill: async (skillData) => {
    const response = await api.post('/skills', skillData);
    return response.data;
  },
  updateSkill: async (id, skillData) => {
    const response = await api.put(`/skills/${id}`, skillData);
    return response.data;
  },
  deleteSkill: async (id) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },

  // Projects
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  addProject: async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  updateProject: async (id, projectData) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },
  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Education
  getEducation: async () => {
    const response = await api.get('/education');
    return response.data;
  },
  addEducation: async (eduData) => {
    const response = await api.post('/education', eduData);
    return response.data;
  },
  updateEducation: async (id, eduData) => {
    const response = await api.put(`/education/${id}`, eduData);
    return response.data;
  },
  deleteEducation: async (id) => {
    const response = await api.delete(`/education/${id}`);
    return response.data;
  },

  // Certifications
  getCertifications: async () => {
    const response = await api.get('/certifications');
    return response.data;
  },
  addCertification: async (certData) => {
    const response = await api.post('/certifications', certData);
    return response.data;
  },
  updateCertification: async (id, certData) => {
    const response = await api.put(`/certifications/${id}`, certData);
    return response.data;
  },
  deleteCertification: async (id) => {
    const response = await api.delete(`/certifications/${id}`);
    return response.data;
  },

  // Experience
  getExperience: async () => {
    const response = await api.get('/experience');
    return response.data;
  },
  addExperience: async (expData) => {
    const response = await api.post('/experience', expData);
    return response.data;
  },
  updateExperience: async (id, expData) => {
    const response = await api.put(`/experience/${id}`, expData);
    return response.data;
  },
  deleteExperience: async (id) => {
    const response = await api.delete(`/experience/${id}`);
    return response.data;
  },

  // Contact Messages
  submitMessage: async (messageData) => {
    const response = await api.post('/messages', messageData);
    return response.data;
  },
  getMessages: async () => {
    const response = await api.get('/messages');
    return response.data;
  },
  deleteMessage: async (id) => {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  },

  // Custom Sections
  getCustomSections: async () => {
    const response = await api.get('/custom-sections');
    return response.data;
  },
  addCustomSection: async (sectionData) => {
    const response = await api.post('/custom-sections', sectionData);
    return response.data;
  },
  updateCustomSection: async (id, sectionData) => {
    const response = await api.put(`/custom-sections/${id}`, sectionData);
    return response.data;
  },
  deleteCustomSection: async (id) => {
    const response = await api.delete(`/custom-sections/${id}`);
    return response.data;
  },
};

export default portfolioService;
