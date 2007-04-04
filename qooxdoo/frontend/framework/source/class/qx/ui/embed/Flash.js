/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2007 1&1 Internet AG, Germany, http://www.1and1.org

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Sebastian Werner (wpbasti)
     * Andreas Ecker (ecker)
   ________________________________________________________________________

   This class contains code based on the following work:

     SWFObject: Javascript Flash Player detection and embed script
     http://blog.deconcept.com/swfobject/
     Version: 1.4.4

     Copyright:
       2006 Geoff Stearns

     License:
       MIT: http://www.opensource.org/licenses/mit-license.php

       Permission is hereby granted, free of charge, to any person obtaining a
       copy of this software and associated documentation files (the "Software"),
       to deal in the Software without restriction, including without limitation
       the rights to use, copy, modify, merge, publish, distribute, sublicense,
       and/or sell copies of the Software, and to permit persons to whom the
       Software is furnished to do so, subject to the following conditions:

       The above copyright notice and this permission notice shall be included in
       all copies or substantial portions of the Software.

       THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
       IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
       FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
       AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
       LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
       FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
       DEALINGS IN THE SOFTWARE.

     Authors:
       * Geoff Stearns (geoff@deconcept.com)

************************************************************************ */

/* ************************************************************************


************************************************************************ */

/**
 * Flash Player detection and embed.
 *
 * This class contains code based on the following work:<br/>
 *   SWFObject: Javascript Flash Player detection and embed script<br/>
 *   http://blog.deconcept.com/swfobject/</br>
 *   Version: 1.4.4
 *
 * License:<br/>
 *   MIT: http://www.opensource.org/licenses/mit-license.php<br/>
 *   For more info, please see the corresponding source file.
 */
qx.Class.define("qx.ui.embed.Flash",
{
  extend : qx.ui.basic.Terminator,




  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param vSource {String} Url of the SWF file to embed
   * @param vVersion {String} Flash version of the SWF file
   */
  construct : function(vSource, vVersion)
  {
    this.base(arguments);

    // Use background handling of qx.ui.core.Widget instead
    this._params = {};
    this._variables = {};

    if (vSource != null) {
      this.setSource(vSource);
    }

    this.setVersion(vVersion != null ? vVersion : qx.ui.embed.Flash.MINREQUIRED);
  },




  /*
  *****************************************************************************
     STATICS
  *****************************************************************************
  */

  statics :
  {
    EXPRESSINSTALL : [ 6, 0, 65 ],
    MINREQUIRED : "1",
    PLAYERVERSION : null,
    PLUGINKEY : "Shockwave Flash",
    ACTIVEXKEY : "ShockwaveFlash.ShockwaveFlash",




    /*
    ---------------------------------------------------------------------------
      PLAYER VERSION CACHE
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type static
     * @return {var} TODOC
     */
    getPlayerVersion : function()
    {
      if (qx.ui.embed.Flash.PLAYERVERSION != null) {
        return qx.ui.embed.Flash.PLAYERVERSION;
      }

      var vPlayerVersion = new qx.type.Version(0, 0, 0);

      if (navigator.plugins && navigator.mimeTypes.length)
      {
        var x = navigator.plugins[qx.ui.embed.Flash.PLUGINKEY];

        if (x && x.description) {
          vPlayerVersion = new qx.type.Version(x.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split("."));
        }
      }
      else if (window.ActiveXObject)
      {
        // do minor version lookup in IE, but avoid fp6 crashing issues
        // see http://blog.deconcept.com/2006/01/11/getvariable-setvariable-crash-internet-explorer-flash-6/
        try {
          var axo = new ActiveXObject(qx.ui.embed.Flash.ACTIVEXKEY + ".7");
        }
        catch(e)
        {
          try
          {
            var axo = new ActiveXObject(qx.ui.embed.Flash.ACTIVEXKEY + ".6");
            vPlayerVersion = new qx.type.Version([ 6, 0, 21 ]);
            axo.AllowScriptAccess = "always"; // throws if player version < 6.0.47 (thanks to Michael Williams @ Adobe for this code)
          }
          catch(e)
          {
            if (vPlayerVersion.major == 6) {
              return vPlayerVersion;
            }
          }

          try {
            axo = new ActiveXObject(qx.ui.embed.Flash.ACTIVEXKEY);
          } catch(e) {}
        }

        if (axo != null) {
          vPlayerVersion = new qx.type.Version(axo.GetVariable("$version").split(" ")[1].split(","));
        }
      }

      return qx.ui.embed.Flash.PLAYERVERSION = vPlayerVersion;
    }
  },




  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    source :
    {
      _legacy : true,
      type    : "string"
    },

    version : { _legacy : true },

    enableExpressInstall :
    {
      _legacy      : true,
      type         : "boolean",
      defaultValue : false
    },

    enableDetection :
    {
      _legacy      : true,
      type         : "boolean",
      defaultValue : true
    },

    redirectUrl :
    {
      _legacy : true,
      type    : "string"
    },

    quality :
    {
      _legacy : true,
      type : "string",
      impl : "param",
      defaultValue : "high",

      possibleValues : [ "low", "autolow", "autohigh", "medium", "high", "best" ]
    },

    scale :
    {
      _legacy        : true,
      type           : "string",
      impl           : "param",
      defaultValue   : "showall",
      possibleValues : [ "showall", "noborder", "excactfit", "noscale" ]
    },

    wmode :
    {
      _legacy        : true,
      type           : "string",
      impl           : "param",
      defaultValue   : "",
      possibleValues : [ "window", "opaque", "transparent" ]
    },

    play :
    {
      _legacy      : true,
      type         : "boolean",
      impl         : "param",
      defaultValue : true
    },

    loop :
    {
      _legacy      : true,
      type         : "boolean",
      impl         : "param",
      defaultValue : true
    },

    menu :
    {
      _legacy      : true,
      type         : "boolean",
      impl         : "param",
      defaultValue : true
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    /*
    ---------------------------------------------------------------------------
      BASICS
    ---------------------------------------------------------------------------
    */

    _version : null,
    _source : "",


    /**
     * TODOC
     *
     * @type member
     * @param el {Element} TODOC
     * @return {void}
     */
    _applyElementData : function(el)
    {
      this.base(arguments, el);

      // Check for ExpressInstall
      this._expressInstall = false;

      if (this.getEnableExpressInstall())
      {
        // check to see if we need to do an express install
        var expressInstallReqVer = new qx.type.Version(qx.ui.embed.Flash.EXPRESSINSTALL);
        var installedVer = qx.ui.embed.Flash.getPlayerVersion();

        if (installedVer.versionIsValid(expressInstallReqVer) && !installedVer.versionIsValid(this._version)) {
          this._expressInstall = true;
        }
      }

      // this.debug("ExpressInstall Enabled: " + this._expressInstall);
      // Apply HTML
      if (!this.getEnableDetection() || this._expressInstall || qx.ui.embed.Flash.getPlayerVersion().versionIsValid(this._version)) {
        el.innerHTML = this.generateHTML();
      }
      else
      {
        var redir = this.getRedirectUrl();

        if (redir != "") {
          document.location.replace(redir);
        }
      }
    },




    /*
    ---------------------------------------------------------------------------
      HTML GENERATOR
    ---------------------------------------------------------------------------
    */

    /**
     * @signature function()
     */
    generateHTML : qx.lang.Object.select(navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length ? "plugin" : "activeX",
    {
      // Netscape Plugin Architecture
      "plugin" : function()
      {
        var html = [];

        // Express Install Handling
        if (this._expressInstall)
        {
          document.title = document.title.slice(0, 47) + ' - Flash Player Installation';

          this.addVariable('MMredirectURL', escape(window.location));
          this.addVariable('MMdoctitle', document.title);
          this.addVariable('MMplayerType', 'PlugIn');
        }

        html.push("<embed type='application/x-shockwave-flash' width='100%' height='100%' src='");
        html.push(this._source);
        html.push("'");

        var params = this.getParams();

        for (var key in params)
        {
          html.push(" ");
          html.push(key);
          html.push("=");
          html.push("'");
          html.push(params[key]);
          html.push("'");
        }

        var pairs = this.getVariablePairs();

        if (pairs.length > 0)
        {
          html.push(" ");
          html.push("flashvars");
          html.push("=");
          html.push("'");
          html.push(pairs);
          html.push("'");
        }

        html.push("></embed>");

        return html.join("");
      },

      // Internet Explorer ActiveX Architecture
      "activeX" : function()
      {
        var html = [];

        // Express Install Handling
        if (this._expressInstall)
        {
          document.title = document.title.slice(0, 47) + ' - Flash Player Installation';

          this.addVariable("MMredirectURL", escape(window.location));
          this.addVariable("MMdoctitle", document.title);
          this.addVariable("MMplayerType", "ActiveX");
        }

        html.push("<object classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' width='100%' height='100%'>");
        html.push("<param name='movie' value='");
        html.push(this._source);
        html.push("'/>");

        var tags = this.generateParamTags();

        if (tags.length > 0) {
          html.push(tags);
        }

        var pairs = this.getVariablePairs();

        if (pairs.length > 0)
        {
          html.push("<param name='flashvars' value='");
          html.push(pairs);
          html.push("'/>");
        }

        html.push("</object>");

        return html.join("");
      }
    }),




    /*
    ---------------------------------------------------------------------------
      MODIFIER
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @param propValue {var} Current value
     * @param propOldValue {var} Previous value
     * @param propName {var} TODOC
     * @return {Boolean} TODOC
     */
    _modifySource : function(propValue, propOldValue, propName)
    {
      this._source = qx.util.Validation.isValidString(propValue) ? qx.manager.object.AliasManager.getInstance().resolvePath(propValue) : "";
      return true;
    },


    /**
     * TODOC
     *
     * @type member
     * @param propValue {var} Current value
     * @param propOldValue {var} Previous value
     * @param propData {var} Property configuration map
     * @return {Boolean} TODOC
     */
    _modifyVersion : function(propValue, propOldValue, propData)
    {
      if (this._version)
      {
        this._version.dispose();
        this._version = null;
      }

      if (qx.util.Validation.isValidString(propValue)) {
        this._version = new qx.type.Version(propValue);
      }

      return true;
    },


    /**
     * TODOC
     *
     * @type member
     * @param propValue {var} Current value
     * @param propOldValue {var} Previous value
     * @param propData {var} Property configuration map
     * @return {Boolean} TODOC
     */
    _modifyParam : function(propValue, propOldValue, propData)
    {
      this.setParam(propData.name, propValue.toString());
      return true;
    },




    /*
    ---------------------------------------------------------------------------
      OVERWRITE BACKGROUND COLOR HANDLING
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @param propValue {var} Current value
     * @param propOldValue {var} Previous value
     * @param propData {var} Property configuration map
     * @return {Boolean} TODOC
     */
    _modifyBackgroundColor : function(propValue, propOldValue, propData)
    {
      if (propOldValue) {
        propOldValue.remove(this);
      }

      if (propValue)
      {
        this._setBackgroundColorProperty(propValue.getHex());
        propValue.add(this);
      }
      else
      {
        this._resetBackgroundColorProperty();
      }

      return true;
    },


    /**
     * TODOC
     *
     * @type member
     * @param vNewValue {var} TODOC
     * @return {void}
     */
    _setBackgroundColorProperty : function(vNewValue) {
      this.setParam("bgcolor", vNewValue);
    },




    /*
    ---------------------------------------------------------------------------
      PARAMS
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @param name {var} TODOC
     * @param value {var} TODOC
     * @return {void}
     */
    setParam : function(name, value) {
      this._params[name] = value;
    },


    /**
     * TODOC
     *
     * @type member
     * @param name {var} TODOC
     * @return {var} TODOC
     */
    getParam : function(name) {
      return this._params[name];
    },


    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    getParams : function() {
      return this._params;
    },




    /*
    ---------------------------------------------------------------------------
      VARIABLES
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @param name {var} TODOC
     * @param value {var} TODOC
     * @return {void}
     */
    setVariable : function(name, value) {
      this._variables[name] = value;
    },


    /**
     * TODOC
     *
     * @type member
     * @param name {var} TODOC
     * @return {var} TODOC
     */
    getVariable : function(name) {
      return this._variables[name];
    },


    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    getVariables : function() {
      return this._variables;
    },




    /*
    ---------------------------------------------------------------------------
      HTML UTILITIES
    ---------------------------------------------------------------------------
    */

    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    generateParamTags : function()
    {
      var vParams = this.getParams();
      var vParamTags = [];

      for (var vKey in vParams)
      {
        vParamTags.push("<param name='");
        vParamTags.push(vKey);
        vParamTags.push("' value='");
        vParamTags.push(vParams[vKey]);
        vParamTags.push("'/>");
      }

      return vParamTags.join("");
    },


    /**
     * TODOC
     *
     * @type member
     * @return {var} TODOC
     */
    getVariablePairs : function()
    {
      var variables = this.getVariables();
      var variablePairs = [];

      for (var key in variables) {
        variablePairs.push(key + "=" + variables[key]);
      }

      return variablePairs.join("&");
    },




    /*
    ---------------------------------------------------------------------------
      METHODS TO GIVE THE LAYOUTERS INFORMATIONS
    ---------------------------------------------------------------------------
    */

    /**
     * @signature function()
     */
    _isWidthEssential : qx.lang.Function.returnTrue,

    /**
     * @signature function()
     */
    _isHeightEssential : qx.lang.Function.returnTrue,




    /*
    ---------------------------------------------------------------------------
      PREFERRED DIMENSIONS
    ---------------------------------------------------------------------------
    */

    /**
     * @signature function()
     */
    _computePreferredInnerWidth : qx.lang.Function.returnZero,

    /**
     * @signature function()
     */
    _computePreferredInnerHeight : qx.lang.Function.returnZero
  },




  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function()
  {
    this._disposeObjects("_version");
    this._disposeFields("_source", "_params", "_variables");
  }
});
