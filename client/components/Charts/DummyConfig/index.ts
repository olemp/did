export const AppointmentStatus: any = {
    chart: {
        type: "pie",
        backgroundColor: 'rgba(0,0,0,0)'
    },
    title: '',
    tooltip: {
        pointFormat: '{series.name}: <br>{point.percentage:.1f} %<br>value: {point.y}'
    },
    plotOptions: {
        pie: {
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b> ({point.y})',
            }
        }
    },
    series: [
        {
            data: [
                {
                    name: 'Matched hours',
                    y: 34
                },
                {
                    name: 'Unmatched hours',
                    y: 9
                }
            ]
        }
    ],
    credits: { enabled: false }
};

