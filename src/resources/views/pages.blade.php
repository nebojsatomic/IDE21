<!DOCTYPE html>
<html>
<head>
	<title>{{ $page[0]->title ?? ''}}</title>

	<meta charset="utf-8" />
    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
<!--
    <script src="https://unpkg.com/react@latest/umd/react.development.js" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/react-dom@latest/umd/react-dom.development.js" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/@material-ui/core@latest/umd/material-ui.development.js" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/babel-standalone@latest/babel.min.js" crossorigin="anonymous"></script>
-->

  <!-- Load React. -->
  <!-- Note: when deploying, replace "development.js" with "production.min.js". 
  <script src="https://unpkg.com/react@17/umd/react.development.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" crossorigin></script>-->

  <!-- Don't use this in production: 
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>-->

    <!-- !!! disable loading of google fonts - should be local fonts !!! Fonts to support Material Design
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" /> -->
    <!-- Icons to support Material Design
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" /> -->

    <?php 
    if($staticFiles) {
	    foreach($staticFiles as $staticFile){
		    if(strstr( $staticFile, '.css') != '' ){
		    ?>
			<link type="text/css" href="<?php echo $staticFile;?>" rel="stylesheet" /> 
		    <?php
			} else if(strstr( $staticFile, '.js') != '' ){
			?>
			<!--<script type="module" src="<?php echo $staticFile;?>"></script>-->
			<?php
			}
	    }
    }?>

</head>
<body style="background: {{ $template[0]->bodyBg ?? '' }}">

{!! $template[0]->output !!}



<script type="module">

  // Find the latest version by visiting https://unpkg.com/three.

  import * as THREE from '/build/three.module.js';

  const scene = new THREE.Scene();

</script>

<script type="module">

  // Find the latest version by visiting https://unpkg.com/three.

  //import { OrbitControls } from '/build/OrbitControls.js';

  //const controls = new OrbitControls();

</script>
</body>
</html> 