/* ************************************************************************

   qooxdoo - the new era of web interface development

   Copyright:
     (C) 2004-2006 by Schlund + Partner AG, Germany
         All rights reserved

   License:
     LGPL 2.1: http://creativecommons.org/licenses/LGPL/2.1/

   Internet:
     * http://qooxdoo.oss.schlund.de

   Authors:
     * Sebastian Werner (wpbasti)
       <sebastian dot werner at 1und1 dot de>
     * Andreas Ecker (aecker)
       <andreas dot ecker at 1und1 dot de>

************************************************************************ */

/* ************************************************************************

#package(appearance)
#post(qx.manager.object.AppearanceManager)

************************************************************************ */

qx.renderer.theme.AppearanceTheme = function(vId, vTitle)
{
  qx.core.Object.call(this);

  this._appearances = {};

  this.setId(vId);
  this.setTitle(qx.util.validator.isValidString(vTitle) ? vTitle : vId);

  qx.manager.object.AppearanceManager.registerTheme(this);
};

qx.renderer.theme.AppearanceTheme.extend(qx.core.Object, "qx.renderer.theme.AppearanceTheme");







/*
---------------------------------------------------------------------------
  PROPERTIES
---------------------------------------------------------------------------
*/

qx.renderer.theme.AppearanceTheme.addProperty({ name : "id", type : QxConst.TYPEOF_STRING, allowNull : false });
qx.renderer.theme.AppearanceTheme.addProperty({ name : "title", type : QxConst.TYPEOF_STRING, allowNull : false, defaultValue : QxConst.CORE_EMPTY });







/*
---------------------------------------------------------------------------
  CORE METHODS
---------------------------------------------------------------------------
*/

proto.registerAppearance = function(vId, vData) {
  this._appearances[vId] = vData;
};

proto.getAppearance = function(vId) {
  return this._appearances[vId];
};

proto.setupAppearance = function(vAppearance)
{
  if (!vAppearance._setupDone)
  {
    if (vAppearance.setup) {
      vAppearance.setup();
    };

    vAppearance._setupDone = true;
  };
};








/*
---------------------------------------------------------------------------
  WIDGET METHODS
---------------------------------------------------------------------------
*/

proto.initialFrom = function(vWidget, vId)
{
  var vAppearance = this.getAppearance(vId);
  if (vAppearance)
  {
    this.setupAppearance(vAppearance);

    try
    {
      return vAppearance.initial ? vAppearance.initial(vWidget, this) : {};
    }
    catch(ex)
    {
      this.error("Couldn't apply initial appearance: " + ex, "initialFrom");
    };
  }
  else
  {
    return this.error("Missing appearance: " + vId, "initialStyleFrom");
  };
};

proto.stateFrom = function(vWidget, vId)
{
  var vAppearance = this.getAppearance(vId);
  if (vAppearance)
  {
    this.setupAppearance(vAppearance);

    try
    {
      return vAppearance.state ? vAppearance.state(vWidget, this, vWidget._states) : {};
    }
    catch(ex)
    {
      this.error("Couldn't apply state appearance: " + ex, "stateFrom");
    };
  }
  else
  {
    return this.error("Missing appearance: " + vId, "stateStyleFrom");
  };
};







/*
---------------------------------------------------------------------------
  DISPOSER
---------------------------------------------------------------------------
*/

proto.dispose = function()
{
  if (this.getDisposed()) {
    return;
  };

  this._appearances = null;

  return qx.core.Object.prototype.dispose.call(this);
};
