
import React, { useState } from 'react';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Portfolio from './components/portfolio/Portfolio';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import AiInputForm from './components/AiInputForm';
import { PortfolioData } from './types';
import { downloadPortfolioAsZip } from './services/downloadService';
import DeployGuideModal from './components/admin/DeployGuideModal';

const AppContent: React.FC = () => {
    const { portfolioData, setPortfolioData } = usePortfolio();
    const { isAdmin } = useAuth();
    const [view, setView] = useState<'input' | 'portfolio' | 'adminLogin'>('input');
    const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'error'>('idle');
    const [showDeployGuide, setShowDeployGuide] = useState(false);

    const handlePortfolioGenerated = (data: PortfolioData) => {
        setPortfolioData(data);
        setView('portfolio');
    };

    const navigateToAdmin = () => {
        setView('adminLogin');
    };

    const navigateToPortfolio = () => {
        setView('portfolio');
    };

    const handleDownload = async () => {
        if (!portfolioData || downloadStatus === 'downloading') return;
        setDownloadStatus('downloading');
        try {
            await downloadPortfolioAsZip(portfolioData);
            setShowDeployGuide(true); // Show guide on success
            setDownloadStatus('idle'); // Revert to idle on success
        } catch (error) {
            console.error("Failed to download portfolio:", error);
            alert(`An error occurred while preparing your download: ${error instanceof Error ? error.message : String(error)}`);
            setDownloadStatus('error');
            // Allow user to see the error state before it resets for retry
            setTimeout(() => setDownloadStatus('idle'), 5000);
        }
    };

    const githubUsername = portfolioData?.personalDetails.github?.split('/').pop() || 'your-username';

    const renderContent = () => {
        if (isAdmin) {
            return <AdminDashboard onLogout={navigateToPortfolio} />;
        }
        switch (view) {
            case 'input':
                return <AiInputForm onGenerated={handlePortfolioGenerated} />;
            case 'portfolio':
                if (portfolioData) {
                    return <Portfolio 
                                onAdminClick={navigateToAdmin} 
                                onDownloadClick={handleDownload}
                                downloadStatus={downloadStatus}
                           />;
                }
                return <AiInputForm onGenerated={handlePortfolioGenerated} />; // Fallback to input if no data
            case 'adminLogin':
                return <AdminLogin onLoginSuccess={() => {}} onBack={navigateToPortfolio} />; // onLoginSuccess will be handled by context
            default:
                return <AiInputForm onGenerated={handlePortfolioGenerated} />;
        }
    };

    return (
        <div className="min-h-screen text-gray-800 dark:text-gray-200">
            {showDeployGuide && <DeployGuideModal onClose={() => setShowDeployGuide(false)} githubUsername={githubUsername} />}
            {renderContent()}
        </div>
    );
};

const App: React.FC = () => {
    return (
        <PortfolioProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </PortfolioProvider>
    );
};

export default App;
