import { IconSettings2 } from "@tabler/icons-react";
import React from "react";


const RouteLayout = ({ icon, title, children, headerItem, iconConfig = false, tabsConfig }) => (
    <div className="route-layout h-full">
        <div className="route-layout-container h-full flex flex-col">
            <div className="route-layout-header border-b-2 bg-gradient-to-r from-orange-400 via-orange-200 to-yellow-100 shadow flex flex-row justify-between items-center rounded-t-xl">
                <div className="header-title flex flex-row gap-3 text-orange-900 p-4 font-bold text-xl items-center">
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
            {tabsConfig && <div className="route-layout-tabs border-b border-orange-300 flex flex-row items-center bg-gradient-to-r from-orange-200 via-yellow-100 to-orange-100 rounded-b-xl overflow-scroll no-scrollbar">
                {
                    tabsConfig.tabs.map(tab => (
                        <div
                            className={`tab-item text-nowrap p-3 px-4 cursor-pointer font-semibold transition-all ${tabsConfig.selected === tab.value ? 'text-orange-900 border-b-2 border-orange-500 bg-orange-200' : 'text-orange-400 hover:text-orange-600'}`}
                            onClick={() => tabsConfig.setSelected(tab.value)}
                            key={tab.label}
                        >{tab.label}</div>
                    ))
                }
            </div>}
            <div className={`route-layout-content flex-1 overflow-y-auto ${tabsConfig ? '' : 'p-4 bg-gradient-to-br from-orange-100 via-orange-200 to-yellow-100 rounded-b-xl'}`}>
                {children}
            </div>
        </div>
    </div>
);

export default RouteLayout;