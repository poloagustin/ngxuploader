(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs/BehaviorSubject')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'rxjs/BehaviorSubject'], factory) :
	(factory((global.ngxuploader = {}),global._angular_core,global._angular_common,global.rxjs_BehaviorSubject));
}(this, (function (exports,_angular_core,_angular_common,rxjs_BehaviorSubject) { 'use strict';

var UploaderService = (function () {
    function UploaderService() {
    }
    /**
     * @return {?}
     */
    UploaderService.prototype.createSubjects = function () {
        this.percentUpload$ = new rxjs_BehaviorSubject.BehaviorSubject(0);
        this.nameUpload$ = new rxjs_BehaviorSubject.BehaviorSubject('');
        this.isUpload$ = new rxjs_BehaviorSubject.BehaviorSubject(false);
    };
    /**
     * @return {?}
     */
    UploaderService.prototype.unsubscribeSubjects = function () {
        if (this.percentUpload$ !== undefined) {
            this.percentUpload$.unsubscribe();
            this.nameUpload$.unsubscribe();
            this.isUpload$.unsubscribe();
        }
    };
    /**
     * @param {?} file
     * @param {?=} token
     * @param {?=} appends
     * @param {?=} urlBackend
     * @return {?}
     */
    UploaderService.prototype.uploadXHR = function (file, token, appends, urlBackend) {
        var _this = this;
        if (token === void 0) { token = ''; }
        this.isUpload$.next(true);
        var /** @type {?} */ files = file.files;
        var /** @type {?} */ formData = new FormData();
        for (var /** @type {?} */ i = 0; i < files.length; i++) {
            formData.append('file', files[i], files[i].name);
        }
        if (appends !== undefined) {
            appends.forEach(function (element) {
                // formData.append('path', 'environment.urlS3ImagePath');
                formData.append(element.name, element.value);
            });
        }
        var /** @type {?} */ xhr = new XMLHttpRequest();
        xhr.open('POST', urlBackend, true);
        xhr.upload.onprogress = function (e) {
            if (e.lengthComputable) {
                _this.percentComplete = (e.loaded / e.total) * 100;
                console.log(_this.percentComplete + '% uploaded');
                _this.percentUpload$.next(_this.percentComplete);
            }
        };
        xhr.onload = function () {
            if (xhr.status === 200) {
                _this.setImageUrl(xhr.responseText);
            }
            else {
                alert('An error occurred!');
            }
            _this.isUpload$.next(false);
        };
        if (token !== '') {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        }
        xhr.send(formData);
    };
    /**
     * @param {?} xhrResponse
     * @return {?}
     */
    UploaderService.prototype.setImageUrl = function (xhrResponse) {
        console.log(xhrResponse);
        this.nameUpload$.next(xhrResponse);
    };
    return UploaderService;
}());
UploaderService.decorators = [
    { type: _angular_core.Injectable },
];
/**
 * @nocollapse
 */
UploaderService.ctorParameters = function () { return []; };

var NgxUploaderComponent = (function () {
    /**
     * @param {?} uploaderService
     */
    function NgxUploaderComponent(uploaderService) {
        this.uploaderService = uploaderService;
        this.file = {};
        this.canSave = true;
        this.percentComplete = 0;
        this.isDrop = false;
        this.token = '';
        this.urlBackend = 'http://localhost:8080/api/file/';
    }
    /**
     * @param {?} v
     * @return {?}
     */
    NgxUploaderComponent.prototype.drop = function (v) {
        this.isDrop = v;
    };
    /**
     * @return {?}
     */
    NgxUploaderComponent.prototype.uploader = function () {
        var _this = this;
        this.uploaderService.unsubscribeSubjects();
        this.drop(false);
        this.fileName = this.fileInput.nativeElement.value.replace('C:\\fakepath\\', '');
        this.uploaderService.createSubjects();
        this.uploaderService.percentUpload$.subscribe({
            next: function (v) { return _this.percentComplete = v; }
        });
        this.uploaderService.nameUpload$.subscribe({
            next: function (v) { return _this.fileName = v; }
        });
        this.uploaderService.isUpload$.subscribe({
            next: function (v) { return _this.canSave = v; }
        });
        this.uploaderService.uploadXHR(this.fileInput.nativeElement, this.token, this.appends, this.urlBackend);
    };
    return NgxUploaderComponent;
}());
NgxUploaderComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngx-uploader-component',
                template: "\n  <div class=\"file\">\n    <div class=\"notImage\"  *ngIf=\"percentComplete === 0\">\n      <input type=\"file\" class=\"file-input\" #fileInput\n      (dragleave)=\"drop(false)\"\n      (dragenter)=\"drop(true)\"\n      (change)=\"uploader()\"\n      />\n      <div class=\"textFileContainer\" *ngIf=\"!isDrop\">\n        <span class=\"fileTitle\">Upload</span> <br />\n        <span class=\"fileRecommend\">Recommended minimum 100x100px</span>\n      </div>\n      <div class=\"textFileContainer\" *ngIf=\"isDrop\">\n        <span class=\"fileTitle\">drop here</span>\n      </div>\n    </div>\n    <span *ngIf=\"percentComplete > 0 && !canSave\">\n      <img [src]=\"fileName\" class=\"img-demo\" />\n      <span class=\"logo-name\"> {{fileName}} </span>\n      <button class=\"remove\"> - </button>\n    </span>\n    <span *ngIf=\"percentComplete > 0 && canSave\"> Uploading </span>\n</div>",
                styles: ["\n   md-dialog-container {\n  background: white;\n}\n.mat-dialog-container {\n    background: white!important;\n}\n\napp-new-channel {\n  background: white;\n}\n.file {\n  border-style: dashed;\n  width: 500px;\n  height: 100px;\n  background-color: gold;\n}\n\n.file-input {\n  width: 100%;\n  height: 100px;\n  position: absolute;\n  z-index: 999999;\n  opacity: 0;\n}\n\n.fileTitle {\n  width: 100%;\n  padding: 10px;\n  text-align: center;\n  font-size: 22px;\n  font-weight: 800;\n}\n\n.textFileContainer {\n    width: 100%;\n    text-align: center;\n    padding-top: 18px;\n}\n\n.inputName {\n  width: 100%;\n  height: 27px;\n  font-size: 16px;\n}\n\n.inputColor {\n  width: 40%;\n  height: 20px;\n  font-size: 16px;\n  margin-left: -4px;\n}\n\n.img-demo {\n  width: 100px;\n  padding: 10px;\n  float: left;\n  height: 70px;\n}\n\n.logo-name{\n  float: left;\n  width: 50%;\n  overflow: hidden;\n}\n\n.remove {\n  float: left;\n  border-radius: 50%;\n}\n \n  "]
            },] },
];
/**
 * @nocollapse
 */
NgxUploaderComponent.ctorParameters = function () { return [
    { type: UploaderService, },
]; };
NgxUploaderComponent.propDecorators = {
    'fileInput': [{ type: _angular_core.ViewChild, args: ['fileInput',] },],
    'token': [{ type: _angular_core.Input },],
    'urlBackend': [{ type: _angular_core.Input },],
    'appends': [{ type: _angular_core.Input },],
};

var NgxUploderModule = (function () {
    function NgxUploderModule() {
    }
    /**
     * @return {?}
     */
    NgxUploderModule.forRoot = function () {
        return {
            ngModule: NgxUploderModule,
            providers: [UploaderService]
        };
    };
    return NgxUploderModule;
}());
NgxUploderModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule
                ],
                declarations: [
                    NgxUploaderComponent
                ],
                exports: [
                    NgxUploaderComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
NgxUploderModule.ctorParameters = function () { return []; };

exports.NgxUploderModule = NgxUploderModule;
exports.NgxUploaderComponent = NgxUploaderComponent;
exports.UploaderService = UploaderService;

Object.defineProperty(exports, '__esModule', { value: true });

})));