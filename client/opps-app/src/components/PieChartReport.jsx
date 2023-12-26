// PieChartReport.jsx
import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';

import { getReportsOpportunitiesGeneral } from '../services/opportunityService';

export default function PieChartReport() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        getReportsOpportunitiesGeneral()
            .then(dataArr => {

                if (dataArr === null)
                    return;

                const documentStyle = getComputedStyle(document.documentElement);
                const data = {
                    labels: ['WON', 'LOST', 'OPEN'],
                    datasets: [
                        {
                            data: [
                                dataArr[0].statusWonCount,
                                dataArr[0].statusLostCount,
                                dataArr[0].statusOpenCount
                            ],
                            backgroundColor: [
                                documentStyle.getPropertyValue('--green-500'),
                                documentStyle.getPropertyValue('--red-500'),
                                documentStyle.getPropertyValue('--blue-500')
                            ],
                            hoverBackgroundColor: [
                                documentStyle.getPropertyValue('--green-400'),
                                documentStyle.getPropertyValue('--red-400'),
                                documentStyle.getPropertyValue('--blue-400')
                            ]
                        }
                    ]
                }
                const options = {
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: true
                            }
                        }
                    },
                    maintainAspectRatio: false
                };

                setChartData(data);
                setChartOptions(options);

                return dataArr;
            })
            .catch(err => console.log(err))
            
    }, []);

    return (
        <div className="chart-container card flex flex-column justify-content-between align-items-start gap-3">
            <label className="font-bold block mb-2">Opportunities Global Statistics</label>
            <div>
                <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" style={{ margin: "5px 0" }} />
            </div>
        </div>
    )
}