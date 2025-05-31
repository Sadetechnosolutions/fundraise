/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // 👈 include all component files
    ],
    theme: {
      extend: {
        animation: {
          border: 'borderMove 4s linear infinite',
        },
        keyframes: {
          borderMove: {
            '0%': { backgroundPosition: '0% 50%' },
            '100%': { backgroundPosition: '100% 50%' },
          },
        },
        colors: {
          button:{
            start:'#05ABB6',
            end:'#6BDBE2',
          },
          transparent:'rgba(255, 255, 255, 0.3)',
          highlight:'#388087',
          login:'#6FB3B8',
          cta:'#00BBAA',
          yellow:'#F8CA55',
          sun:'#FF9900',
          shade:'#F8F8FF',
          yoi:'#B4F1CF',
          background:'#EB373F',
          ctao:'#FF6161',
          read:'#116466',
          red:'#F85454',
          birthdaybg:'#FFECF0',
          purple:'#B8A7FB',
          viola:'#583EBC',
          pink:'#EE266E',
          active:'#3ABC6C',
          sky:'#E5F0FD',
          orange:'#EE266E',
          shortcut:'#6FA8FF',
          story:{
            start:'#EE266E',
            end:'#5CBE8F',
          },
          fb:'#1B80E4',
          whatsapp:'#3ABC6C',
          page:'#BFC138',
          span:{
            start:'#3AB4BC',
            end:'#5CBE8F',
          },
                    blood:{
            start:'#b80000',
            end:'#ffc0cb',
          },
        },
        screens: {
          'custom': '400px',
          'small': '721px',
          'medium': '968px', 
          'med':'1200px',
          'sl': '1600px',
          'xl' : '1800px'
        },
      },
    },
    plugins: [],
  }
  