app.FrontEndEditor.prototype.styleBuilder = (function () {
    return {
        addRule: function (css, rule) {
            var medias = [];
            if (this.isResponsive) {
                if (this.activeMedia) {
                    var media = css.getMedia(this.activeMedia);
                    if (!media) {
                        media = css.addMedia(this.activeMedia);
                    }
                    medias.push({media: media, rule: ".responsive " + rule})
                }

                var global_rule = css.getRule(rule);
                if (!this.activeMedia || !global_rule) {
                    medias.push({media: css, rule: rule})
                }
            } else {
                medias.push({media: css, rule: rule})
            }
            medias.every(function () {
                this.media.addRule(this.rule)
            })
        },
        removeRule: function (css, uuid, rule, allMedia) {
            var medias = [];
            if (allMedia) {
                medias.push(css);
                var all = css.getMedias();
                if (all.length) {
                    medias.pushAll(all)
                }
            } else if (this.activeMedia) {
                var media = css.getMedia(this.activeMedia);
                if (media) {
                    medias.push(media)
                }
            } else {
                medias.push(css)
            }
            var removes = [];
            medias.every(function () {
                var _rule = this.removeRule(rule);
                if (_rule) {
                    removes.push([this, _rule])
                }
            });
            this.persist(uuid, css);
            return removes
        },
        update: function (css, uuid, rule, addedAttributes, removedAttributes, mediadef, copy_global) {
            var medias = [];
            var rules = [];
            mediadef = mediadef !== undefined ? mediadef : this.activeMedia;
            if (mediadef) {
                var media = css.getMedia(mediadef);
                if (!media) {
                    media = css.addMedia(mediadef)
                }
                medias.push({media: media, rule: ".responsive " + rule});

                if (copy_global) {
                    medias.push({media: css, rule: rule})
                }
            } else {
                medias.push({media: css, rule: rule})
            }

            medias.every(function () {
                var _rule = this.media.getRule(this.rule);
                if (!_rule) {
                    _rule = this.media.addRule(this.rule)
                }
                rules.push(_rule)
            });

            if (addedAttributes) {
                rules.every(function () {
                    this.setAttribute(addedAttributes)
                })
            }

            if (removedAttributes) {
                rules.every(function () {
                    this.removeAttribute(removedAttributes)
                })
            }
            this.persist(uuid, css)
        },
        persist: function (uuid, css) {
            app.FrontEndEditor.utils.persistCss(uuid, css);
        }
    }
});

