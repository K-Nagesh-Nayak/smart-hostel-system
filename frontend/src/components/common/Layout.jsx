import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64"> 
        {/* ml-64 pushes content to right so sidebar doesn't cover it */}
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;