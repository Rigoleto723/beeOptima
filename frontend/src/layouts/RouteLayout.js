import { IconSettings2 } from "@tabler/icons-react";
import React from "react";
import "./styles.css"


const RouteLayout = ({ icon, title, children, headerItem, iconConfig = false, tabsConfig }) => (
    <div className="route-layout h-full">
        <div className="route-layout-container h-full flex flex-col">
            <div className="route-layout-header border-b-1 border-gray-700 flex flex-row justify-between items-center">
                <div className="header-title flex flex-row gap-3 text-white p-4">
                    <div className="relative">
                        {icon}
                        {iconConfig && <div className="absolute bottom-0 right-0 bg-black rounded-lg">
                            <IconSettings2 size={"0.7em"} />
                        </div>}
                    </div>
                    {title}
                </div>
                {headerItem}
            </div>
            {tabsConfig && <div className="route-layout-tabs border-b border-gray-600 flex flex-row items-center overflow-scroll no-scrollbar">
                {
                    tabsConfig.tabs.map(tab => (
                        <div 
                            className={`tab-item text-nowrap p-3 px-4 cursor-pointer ${tabsConfig.selected === tab.value ? 'text-white border-b border-white' : 'text-gray-500 hover:text-gray-400'}`}
                            onClick={() => tabsConfig.setSelected(tab.value)}
                            key={tab.label}
                        >{tab.label}</div>
                    ))
                }
            </div>}
            <div className={`route-layout-content flex-1 overflow-y-auto ${tabsConfig ? '' : 'p-4'}`}>
                {children}
            </div>
        </div>
    </div>
);

export default RouteLayout;