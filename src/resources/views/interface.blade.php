<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
    <title>IDE21 interface</title>
    <!-- Fonts to support Material Design -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <!-- Icons to support Material Design -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    <script src="/public/js/react.development.js" crossorigin="anonymous"></script>
    <script src="/public/js/react-dom.development.js" crossorigin="anonymous"></script>
    <script src="/public/js/material-ui.development.js" crossorigin="anonymous"></script>
    <script src="/public/js/babel.min.js" crossorigin="anonymous"></script>
</head>
<body>
    <a href="#" id="open-page">open page</a>
    <div id="root"></div>

    <script src="{{ asset('public/js/app.js') }}" type="text/javascript">
        
    </script>

    <script>
        function openP() {
        document.querySelector('#open-page').addEventListener('click', function(){
            
            window.parent.document.getElementById('openPage').click(); 
        }, false );
        }
        openP();
    </script>
</body>
</html>