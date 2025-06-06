import React from "react";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-3xl font-bold mb-4 text-primary-700 dark:text-primary-300">Bem-vindo ao Jira Dashboards</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 text-center max-w-xl">
        Este é um sistema de dashboards para visualização e gestão de dados do backlog do Jira.
        <br />
        Use o menu acima para navegar entre as funcionalidades.
      </p>
     
    </div>
  );
};

export default Home; 