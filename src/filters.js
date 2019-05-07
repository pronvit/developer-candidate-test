//TODO: classes need to be created and some of the logic from app.js moved here

export const peopleFilters = [
    {
        id: 'gender1',
        title: 'Gender',
        field: 'gender',
        type: 'single-select',
        options: [ { t:'Any', v:'' }, { t:'Male', v:'male' }, { t:'Female', v:'female' } ],
        initValue: () => '',
    }, 
    {
        id: 'age1',
        title: 'Age',
        longTitle: 'Age (inputs)',
        field: 'age',
        type: 'minmax-input',
        initValue: () => ['', ''],
    },
    {
        id: 'age2',
        title: 'Age',
        longTitle: 'Age (selects)',
        field: 'age',
        type: 'minmax-select',
        options: [ { t:'Any', v:'' }, 20, 30, 40, 50 ],
        initValue: () => ['', ''],
    },
    {
        id: 'age3',
        title: 'Age',
        longTitle: 'Age (ranges)',
        field: 'age',
        type: 'range',
        options: [ { t:'Any', v:'-' }, { t:'< 20', v:'-20' }, '20-30', '30-40', '40-50', { t:'>= 50', v:'50-' } ],
        initValue: () => '-',
    }, 
];