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

export const ProjectAllocation: any = {
    chart: {
        type: 'column',
        backgroundColor: 'rgba(0,0,0,0)'
    },
    title: {
        text: ''
    },
    xAxis: {
        categories: [
            'DMS',
            'ASSIST',
            'VAC',
        ],
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Hours'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y} hours</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: 'This week',
        data: [34, 12, 8]

    }],
    credits: { enabled: false }
};