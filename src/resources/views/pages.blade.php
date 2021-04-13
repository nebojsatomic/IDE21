<!DOCTYPE html>
<html>
<head>
	<title>{{ $page[0]->title ?? ''}}</title>
    <?php 
    if($staticFiles) {
	    foreach($staticFiles as $staticFile){
		    if(strstr( $staticFile, '.css') != '' ){
		    ?>
			<link type="text/css" href="<?php echo $staticFile;?>" rel="stylesheet" /> 
		    <?php
			} else if(strstr( $staticFile, '.js') != '' ){
			?>
			<script type="text/javascript" src="<?php echo $staticFile;?>"></script>
			<?php
			}
	    }
    }?>

</head>
<body style="background: {{ $template[0]->bodyBg ?? '' }}">

{!! $template[0]->output !!}

</body>
</html> 