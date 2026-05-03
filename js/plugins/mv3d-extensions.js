//=============================================================================
// mv3d-extensions.js
//=============================================================================

/*:
 * @plugindesc mv3d Extensions -- Extension methods and bug fixes for MV3D.
 * @author Taylor Jeude
 *
 * @help This plugin does not provide plugin commands.
 *
 * Exposed extension methods:
 *
 *  /// Returns all models currently in a MV3D scene.
 *  mv3d.getMeshes();
 *
 *  /// Restores a model (mesh) to its original transparency value, if applicable.
 *  mv3d.restoreMeshAlpha(mesh);
 *
 *  /// Restores all models to their original transparency value.
 *  mv3d.restoreMeshLayerAlpha();
 *
 *  /// Sets a particular model (mesh) to a specific transparency value (alpha) between 0 and 1.
 *  mv3d.setMeshAlpha(mesh, alpha);
 *
 *  /// Sets all models to a specific transparency value (alpha) between 0 and 1.
 *  mv3d.setMeshLayerAlpha(alpha); 
 */

mv3d.getMeshes = function () {
  var meshes = [];
  for (var i = 0; i < mv3d.scene.meshes.length; i++) {
    var mesh = mv3d.scene.meshes[i];
    if (mesh != null && (!mesh.id || mesh.id.startsWith("mesh_"))) {
      meshes.push(mesh);
    }
  }
  return meshes;
};

mv3d.restoreMeshLayerAlpha = function () {
  var meshes = mv3d.getMeshes();
  for (var i = 0; i < meshes.length; i++) {
    mv3d.restoreMeshAlpha(meshes[i]);
  }
};

mv3d.restoreMeshAlpha = function (mesh) {
  if (mesh != null) {
    if (mesh.material.originalAlpha != null) {
      mesh.material.alpha = mesh.material.originalAlpha;
      mesh.material.originalAlpha = null;
    }
    if (mesh.subMeshes) {
      for (var j = 0; j < mesh.subMeshes.length; j++) {
        if (mesh.subMeshes[j]._currentMaterial.originalAlpha != null) {
          mesh.subMeshes[j]._currentMaterial.alpha =
            mesh.subMeshes[j]._currentMaterial.originalAlpha;
          mesh.subMeshes[j]._currentMaterial.originalAlpha = null;
        }
      }
    }
  }
};

mv3d.setMeshLayerAlpha = function (alpha) {
  if (alpha != null) {
    alpha = Math.max(0, Math.min(1, alpha));
    var meshes = mv3d.getMeshes();
    for (var i = 0; i < meshes.length; i++) {
      mv3d.setMeshAlpha(meshes[i], alpha);
    }
  }
};

mv3d.setMeshAlpha = function (mesh, alpha) {
  if (mesh != null && alpha != null) {
    alpha = Math.max(0, Math.min(1, alpha));

    if (mesh.material.originalAlpha == null) {
      mesh.material.originalAlpha = mesh.material.alpha;
    }
    mesh.material.alpha = alpha;
    if (mesh.subMeshes) {
      for (var j = 0; j < mesh.subMeshes.length; j++) {
        if (mesh.subMeshes[j]._currentMaterial.originalAlpha == null) {
          mesh.subMeshes[j]._currentMaterial.originalAlpha =
            mesh.subMeshes[j]._currentMaterial.alpha;
        }
        mesh.subMeshes[j]._currentMaterial.alpha = alpha;
      }
    }
  }
};


const _mv3dExtensionsPluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
  if (command.toLowerCase() !== 'mv3d-ext') {
    return _mv3dExtensionsPluginCommand.apply(this, arguments);
  }
  runPluginCommand(this, args);
};

function runPluginCommand(interpreter, args) {
  const target = args[0].toLowerCase();
  const command = args[1].toLowerCase();
  const variableNumber = Number(args[2]);

  let result;

  if (target == 'camera') {
    if (command == 'yaw') {
      result = mv3d.blendCameraYaw.currentValue();
    } else if (command == 'height') {
      result = mv3d.blendCameraHeight.currentValue();
    } else if (command == 'pitch') {
      result = mv3d.blendCameraPitch.currentValue();
    } else if (command == 'roll') {
      result = mv3d.blendCameraRoll.currentValue();
    } else if (command == 'dist') {
      result = mv3d.blendCameraDist.currentValue();
    } else if (command == 'zoom') {
      result = mv3d.blendCameraZoom.currentValue();
    } else if (command == 'pan-x') {
      result = mv3d.blendPanX.currentValue();
    } else if (command == 'pan-y') {
      result = mv3d.blendPanY.currentValue();
    }
  }

  $gameVariables.setValue(variableNumber, result);
}