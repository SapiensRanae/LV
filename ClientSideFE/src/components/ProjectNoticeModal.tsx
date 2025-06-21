import React from 'react';
import './ProjectNoticeModal.css';

interface ProjectNoticeModalProps {
    onClose: () => void;
}

const ProjectNoticeModal: React.FC<ProjectNoticeModalProps> = ({ onClose }) => (
    <div className="project-notice-overlay" onClick={onClose}>
        <div className="project-notice-modal" onClick={e => e.stopPropagation()}>
            <button className="project-notice-close" onClick={onClose}>
                ×
            </button>
            <h2>Project Notice</h2>
            <p>
                This is not a real casino. You cannot spend real money here – it’s just a demo project.
            </p>
            <button className="project-notice-button" onClick={onClose}>
                Got it
            </button>
        </div>
    </div>
);

export default ProjectNoticeModal;