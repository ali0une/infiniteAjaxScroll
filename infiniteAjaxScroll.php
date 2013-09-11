<?php
/**
 * Classe infiniteAjaxScroll
 *
 * @version	1.0
 * @date	12/04/2013
 * @author	i M@N
 **/
class infiniteAjaxScroll extends plxPlugin {
	
	
	/**
	 * Constructeur de la classe
	 *
	 * @return	null
	 * @author	i M@N 
	 **/	
	public function __construct($default_lang) {

		# Appel du constructeur de la classe plxPlugin (obligatoire)
		parent::__construct($default_lang);
		$this->setConfigProfil(PROFIL_ADMIN);
		# Ajouts des hooks
		$this->addHook('ThemeEndHead', 'ThemeEndHead');
		$this->addHook('ThemeEndBody', 'ThemeEndBody');
	}

	
	/**
	 * Méthode pour afficher la mise en page 
	 *
	 * @author i M@N
	 */
	public function ThemeEndHead()
	{
		echo "\t".'<link rel="stylesheet" type="text/css" href="'.PLX_PLUGINS.'infiniteAjaxScroll/ias.css" media="screen" />'."\n";
	}
	
	/**
	 * Méthode pour afficher le javascript
	 *
	 * @author i M@N
	 */
	public function ThemeEndBody()
	{
/*require PluXML jQuery plugin*/
	echo '<script type="text/javascript">
/* <![CDATA[ */
	!window.jQuery && document.write(\'<script type="text/javascript" src="<?php echo PLX_PLUGINS;?>jquery/jquery.min.js"><\/script>\');
/* !]]> */
</script>
<script type="text/javascript" src="'.PLX_PLUGINS.'infiniteAjaxScroll/jquery.ias.js"></script>
<script type="text/javascript">
$(document).ready(function() {
/* ias */
$.ias({
	container : \'#article\',
	item: \'.article\',
	pagination: \'#pagination\',
	next: \'span.p_next a\',
	loader: \'<img src="<?php $plxShow->template(); ?>/img/loader.gif"/>\',
history: false,
triggerPageThreshold: 100,
//trigger: "Charger plus d\'articles",
thresholdMargin: -200,
//noneleft: "Fin",
/* plugins */
onRenderComplete: function(items) {
/* zoombox */
if($.isFunction($.zoombox)) {
$(\'a.zoombox\').zoombox();
				// You can also use specific options
				$(\'a.zoombox\').zoombox({
					theme		: \'zoombox\',	// available themes : zoombox, lightbox, prettyphoto, darkprettyphoto, simple
					opacity		: 0.8,	// Black overlay opacity
					duration	: 800,	// Animation duration
					animation	: true,	// Do we have to animate the box ?
					width		: 800,		// Default width
					height		: 600,	// Default height
					gallery		: true,	// Allow gallery thumb view
					autoplay	: false	// Autoplay for video
				});
}
else {
	/* doesnt exists... cry?!? */
	return false;
}
/* fitvids */
if($(".fitvids").fitVids()) {
	$(".fitvids").fitVids();
}
else {
	/* doesnt exists... cry?!? */
	return false;
}
/* SyntaxHighlighter */
if($(\'pre\').each(function(i){})) {
				var reg = RegExp(\'<br>\',\'g\');
				$(\'pre\').each(function(i) { 
					var content = $(this).html();
					content = content.replace(reg,"\n");
					$(this).html(content);
				});
				SyntaxHighlighter.highlight({\'toolbar\' : \'false\'});
}
else {
	/* doesnt exists... cry?!? */
	return false;
}
}
});
})
</script>'."\n";
	}
}	
