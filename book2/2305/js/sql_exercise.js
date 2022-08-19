hljs.registerLanguage("sql", function(a) {
    var c = {
        cN: "comment",
        b: "--",
        e: "$"
    };
    return {
        cI: !0,
        i: /[<>]/,
        c: [{
            cN: "operator",
            bK: "begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate savepoint release unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup",
            e: /;/,
            eW: !0,
            k: {
                keyword: "abs absolute acos action add adddate addtime aes_decrypt aes_encrypt after aggregate all allocate alter analyze and any are as asc ascii asin assertion at atan atan2 atn2 authorization authors avg backup before begin benchmark between bin binlog bit_and bit_count bit_length bit_or bit_xor both by cache call cascade cascaded case cast catalog ceil ceiling chain change changed char_length character_length charindex charset check checksum checksum_agg choose close coalesce coercibility collate collation collationproperty columns columns_updated commit compress concat concat_ws concurrent connect connection connection_id consistent constraint constraints continue contributors conv convert convert_tz corresponding cos cot count count_big crc32 create cross cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime data database databases datalength date_add date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts datetimeoffsetfromparts day dayname dayofmonth dayofweek dayofyear deallocate declare decode default deferrable deferred degrees delayed delete des_decrypt des_encrypt des_key_file desc describe descriptor diagnostics difference disconnect distinct distinctrow div do domain double drop dumpfile each else elt enclosed encode encrypt end end-exec engine engines eomonth errors escape escaped event eventdata events except exception exec execute exists exp explain export_set extended external extract fast fetch field fields find_in_set first first_value floor flush for force foreign format found found_rows from from_base64 from_days from_unixtime full function get get_format get_lock getdate getutcdate global go goto grant grants greatest group group_concat grouping grouping_id gtid_subset gtid_subtract handler having help hex high_priority hosts hour ident_current ident_incr ident_seed identified identity if ifnull ignore iif ilike immediate in index indicator inet6_aton inet6_ntoa inet_aton inet_ntoa infile initially inner innodb input insert install instr intersect into is is_free_lock is_ipv4 is_ipv4_compat is_ipv4_mapped is_not is_not_null is_used_lock isdate isnull isolation join key kill language last last_day last_insert_id last_value lcase lead leading least leaves left len lenght level like limit lines ln load load_file local localtime localtimestamp locate lock log log10 log2 logfile logs low_priority lower lpad ltrim make_set makedate maketime master master_pos_wait match matched max md5 medium merge microsecond mid min minute mod mode module month monthname mutex name_const names national natural nchar next no no_write_to_binlog not now null nullif nvarchar oct octet_length of offset old_password on only open optimize option optionally or ord order outer outfile output pad parse partial partition password patindex percent_rank percentile_cont percentile_disc period_add period_diff pi plugin position pow power pragma precision prepare preserve primary prior privileges procedure procedure_analyze processlist profile profiles public publishingservername purge quarter query quick quote quotename radians rand read references regexp relative relaylog release release_lock rename repair repeat replace replicate reset restore restrict return returns reverse revoke right rlike rollback rollup round row row_count rows rpad rtrim savepoint schema scroll sec_to_time second section select serializable server session session_user set sha sha1 sha2 share show sign sin size slave sleep smalldatetimefromparts snapshot some soname soundex sounds_like space sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_no_cache sql_small_result sql_variant_property sqlstate sqrt square start starting status std stddev stddev_pop stddev_samp stdev stdevp stop str str_to_date straight_join strcmp string stuff subdate substr substring subtime subtring_index sum switchoffset sysdate sysdatetime sysdatetimeoffset system_user sysutcdatetime table tables tablespace tan temporary terminated tertiary_weights then time time_format time_to_sec timediff timefromparts timestamp timestampadd timestampdiff timezone_hour timezone_minute to to_base64 to_days to_seconds todatetimeoffset trailing transaction translation trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse ucase uncompress uncompressed_length unhex unicode uninstall union unique unix_timestamp unknown unlock update upgrade upped upper usage use user user_resources using utc_date utc_time utc_timestamp uuid uuid_short validate_password_strength value values var var_pop var_samp variables variance varp version view warnings week weekday weekofyear weight_string when whenever where with work write xml xor year yearweek zon",
                literal: "true false",
                built_in: "array bigint binary bit blob boolean char character date dec decimal float int integer interval number numeric real serial smallint varchar varying int8 serial8 text"
            },
            c: [{
                cN: "string",
                b: "'",
                e: "'",
                c: [a.BE, {
                    b: "''"
                }]
            }, {
                cN: "string",
                b: '"',
                e: '"',
                c: [a.BE, {
                    b: '""'
                }]
            }, {
                cN: "string",
                b: "`",
                e: "`",
                c: [a.BE]
            }, a.CNM, a.CBCM, c]
        }, a.CBCM, c]
    }
});
Date.now || (Date.prototype.now = function() {
    return (new Date).getTime()
});
jQuery.fn.reverse = [].reverse;
var GA_PAGE_KEY, FOCUS_CONTINUE_BUTTON_ON_COMPLETE = !1,
    ALLOW_SCROLL_RO_DATATABLES = !0,
    DEBUG = 1;

function Db(a) {
    this.db = new SQL.Database(a)
}
Db.prototype.query = function(a) {
    if (DEBUG) var c = Date.now();
    var b = null,
        d = null;
    try {
        b = this.db.exec(a)[0]
    } catch (e) {
        d = e
    }
    DEBUG && console.log("Query: " + a, Date.now() - c);
    return new DbResult(b, d)
};
Db.prototype.close = function() {
    this.db.close()
};

function DbResult(a, c) {
    this.columns = [];
    this.rows = [];
    this.isUnknownError = this.isNoSuchTableError = this.isNoSuchColumnError = this.isNullSelection = !1;
    this.errorMessage = null;
    if (a) {
        var b = a.columns;
        $.each(a.values, $.proxy(function(a, c) {
            var d = {};
            $.each(c, $.proxy(function(a, c) {
                d[b[a]] = c
            }, this));
            d._values = c;
            this.rows.push(d)
        }, this));
        this.columns = b
    } else if (c) {
        var d = function(a) {
            a = a.replace("no such column", "ni stolpca");
            a = a.replace("no such table", "ni tabele");
            return a.charAt(0).toUpperCase() + a.slice(1)
        };
        this.isNoSuchColumnError = /no such column/.test(c.message);
        this.isNoSuchTableError = /no such table/.test(c.message);
        this.errorMessage = (this.isUnknownError = !this.isNoSuchColumnError && !this.isNoSuchTableError) ? "Nepopolna poizvedba SQL" : d(c.message)
    } else this.isNullSelection = !0
}
DbResult.prototype.isError = function() {
    return this.isNoSuchTableError || this.isNoSuchColumnError || this.isUnknownError
};

function DbTableRenderer() {
    this.lastDbr = this.selectionDbr = this.defaultDbr = null
}
DbTableRenderer.prototype.initialize = function(a) {
    this.defaultDbr = a
};
DbTableRenderer.prototype.select = function(a) {
    this.selectionDbr = a;
    this.render()
};
DbTableRenderer.prototype.render = function() {
    var a = this._render();
    a && this.renderTargetJqEl.html(a)
};
DbTableRenderer.prototype._render = function() {
    if (null == this.selectionDbr) return "Napaka: prièakovana je izbira";
    var a = this.selectionDbr,
        c = this.selectionDbr,
        b = this.selectionDbr;
    b.isNullSelection ? (c = this.lastDbr, b = null) : b.isError() ? (c = this.lastDbr, b = null) : this.lastDbr = a;
    if (c || b) {
        var d = "<table class='table table-striped table-condensed'><tr style='background-color:lightgrey'><th class='column_name'>" + c.columns.join("</th><th class='column_name'>") + "</th></tr>";
        b && $.each(b.rows, function(a, b) {
            d += "<tr><td>" + b._values.join("</td><td>") + "</td></tr>"
        });
        d += "</table>"
    }
    return d
};
DbTableRenderer.prototype.setRenderOptions = function(a) {
    this.renderTargetJqEl = a
};

function Exercise(a, c, b) {
    this.db = c;
    this.data = b;
    this.autoRunInput = !("manualSubmit" in this.data);
    this.exerciseJqEl = a;
    this.tableJqEls = a.find(".datatable").reverse();
    this.tableRenderers = [];
    this.tasks = [];
    this.tasksListJqEl = a.find(".tasks_list");
    this.submitJqEl = a.find(".submit");
    this.clearJqEl = a.find(".clear");
    this.editorJqEl = a.find(".sqlinput");
    this.editorTargetDatatableId = this.editorJqEl.attr("targetDatatableId");
    this.editorTargetDatatableRenderer = null;
    this.editor = ace.edit(this.editorJqEl[0]);
    this.editorLastSqlQuery = this.editorInputTimeoutTimer = null;
    this.solutionJqEl = a.find(".solution_trigger");
    this.continueJqEl = a.find(".continue");
    this.messageJqEl = a.find(".message");
    this.messageTimeoutTimer = null
}
Exercise.prototype.proxy = function(a) {
    return $.proxy(a, this)
};
Exercise.prototype.initialize = function() {
    this.initializeTables();
    this.initializeTasks();
    this.initializeEditor()
};
Exercise.prototype.initializeTables = function() {
    this.tableJqEls.each(this.proxy(function(a, c) {
        if (DEBUG) var b = Date.now();
        var d = $(c).attr("datatableId"),
            e = new DbTableRenderer,
            f = this.data.datatable[d].preloadTableAction;
        if (f)
            if ("randomizeRows" == f.action) {
                var l = this.db.query("SELECT * FROM " + f.column + " ORDER BY RANDOM()");
                this.db.query("DELETE FROM " + f.column);
                $.each(l.rows, this.proxy(function(a, b) {
                    b._values[0] = a + 1;
                    this.db.query('INSERT INTO Film VALUES ("' + b._values.join('","') + '");')
                }))
            } else alert("Neveljavno prednaloženo dejanje");
        else(f = this.data.datatable[d].preloadTableQuery) && (this.db.query(f) || alert("Neveljavne prednaložene poizvedbe"));
        this.editorLastSqlQuery = this.data.datatable[d].defaultQuery;
        f = this.db.query(this.editorLastSqlQuery);
        e.initialize(f);
        e.setRenderOptions($(c));
        e.select(f);
        this.tableRenderers.push(e);
        this.editorTargetDatatableId == d && (this.editorTargetDatatableRenderer = e);
        f.errorMessage ? this.showMessage(f.errorMessage, "error", null) : this.hideMessage();
        DEBUG && console.log("initializeTable: " + a, Date.now() - b)
    }))
};
Exercise.prototype.initializeTasks = function() {
    if (DEBUG) var a = Date.now();
    $.each(this.data.tasks, this.proxy(function(a, b) {
        this.tasks.push(new Task(this.db, "queryChecks" in b ? b.queryChecks : null, b.checks, b.solution, b.userSolution, b.postValidateAction))
    }));
    $(this.tasksListJqEl.children("li")[0]).addClass("active");
    this.solutionJqEl.on("click", this.proxy(function(a) {
        for (var b = null, d = 0, e = 0; e < this.tasks.length; e++)
            if (b = this.tasks[e], !b.isSatisfied()) {
                d = e;
                break
            };
        this.editor.setValue(b.getUserSolution());
        this.tableJqEls.scrollTop(0);
        a.preventDefault();
        return !1
    }));
    this.continueJqEl.on("click", this.proxy(function(a) {
        var b = !0;
        $.each(this.tasks, this.proxy(function(a, c) {
            b = b && c.isSatisfied()
        }));
        return b ? !0 : (a.preventDefault(), !1)
    }));
    0 == this.tasks.length && this.enableContinueButton();
    this.submitJqEl.on("click", this.proxy(function(a) {
        this.editor.focus();
        this.updateFromSql();
        a.preventDefault();
        return !1
    }));
    this.clearJqEl.on("click", this.proxy(function(a) {
        this.editor.setValue(this.data.datatable[this.editorTargetDatatableId].defaultQuery);
        this.autoRunInput && this.updateFromSql();
        a.preventDefault();
        return !1
    }));
    DEBUG && console.log("initializeTasks", Date.now() - a)
};
Exercise.prototype.initializeEditor = function() {
    if (DEBUG) var a = Date.now();
    this.editor.renderer.setShowGutter(!1);
    this.editor.renderer.setPrintMarginColumn(!1);
    this.editor.renderer.setShowPrintMargin(!1);
    this.editor.renderer.setPadding(16);
    this.editor.setHighlightActiveLine(!1);
    this.editor.setTheme("ace/theme/sqlserver");
    this.editor.getSession().setMode("ace/mode/sql");
    this.editor.getSession().setUseWrapMode(!0);
    this.editor.setValue(this.data.inputDefaultQuery);
    this.editor.clearSelection();
    this.editor.blur();
    if (this.autoRunInput) this.editor.on("change", this.proxy(function() {
        this.requestUpdateFromSql()
    }));
    if (window.innerHeight) {
        var c = this.editorJqEl.offset().top,
            b = $(window);
        b.on("scroll", this.proxy(function() {
            var a = b.scrollTop();
            a <= c && c <= a + window.innerHeight && this.editor.focus()
        }))
    }
    this.editor.commands.removeCommand("gotoline");
    this.editor.commands.removeCommand("find");
    this.editor.commands.removeCommand("findnext");
    DEBUG && console.log("initializeEditor", Date.now() - a)
};
Exercise.prototype.requestUpdateFromSql = function() {
    null != this.editorInputTimeoutTimer && clearTimeout(this.editorInputTimeoutTimer);
    this.editorInputTimeoutTimer = setTimeout(this.proxy(function() {
        this.updateFromSql();
        this.editorInputTimeoutTimer = null
    }), 300)
};
Exercise.prototype.updateFromSql = function() {
    if (DEBUG) var a = Date.now();
    var c = $.trim(this.editor.getValue()).replace(/\s\s+/g, " ");
    if (!this.autoRunInput || c != this.editorLastSqlQuery)
        if (this.autoRunInput || this.showMessage("Posodabljam ...", null, 700), this.editorLastSqlQuery = c, 0 == c.length) {
            for (var a = this.data.inputDefaultQuery, b = this.tasks.length - 1; 0 <= b; b--)
                if (this.tasks[b].isSatisfied() && this.tasks[b].hasPostValidateAction()) {
                    a = this.tasks[b].getPostValidateQuery();
                    break
                }
            b = this.db.query(a);
            this.editorTargetDatatableRenderer.select(b)
        } else {
            for (var d = null, e = -1, b = 0; b < this.tasks.length; b++)
                if (!this.tasks[b].isSatisfied()) {
                    d = this.tasks[b];
                    e = b;
                    break
                }
            if (d && !d.verifySqlInput(c)) this.showMessage("Èakam na zakljuèeno poizvedbo ...", null, null);
            else if (b = this.db.query(c), b.errorMessage) this.showMessage(b.errorMessage, "error", null);
            else {
                this.autoRunInput && this.hideMessage();
                this.editorTargetDatatableRenderer.select(b);
                if (d && d.verify(c, b)) {
                    c = $(this.tasksListJqEl.children("li")[e]);
                    c.html("<span class='completed'>" + c.html() + " <span class='check'>&#10003;</span></span>");
                    c.find(".hint").remove();
                    e < this.tasks.length - 1 && (c = $(this.tasksListJqEl.children("li")[e + 1]), c.addClass("active"));
                    if (this.tasks[e].hasPostValidateAction() && ((c = this.tasks[e].getPostValidateActionRunOnce()) && this.db.query(c), c = this.tasks[e].getPostValidateQuery())) {
                        var f = this.tasks[e].getPostValidateMessage(),
                            b = this.db.query(c);
                        this.editorTargetDatatableRenderer.select(b);
                        setTimeout(this.proxy(function() {
                            this.showMessage(f, null, 2E3, function() {
                                this.editor.setValue("");
                                this.editor.clearSelection()
                            })
                        }), 100)
                    }
                    e == this.tasks.length - 1 && this.enableContinueButton()
                }
                DEBUG && console.log("updateFromSql - preUpdateTables", Date.now() - a);
                this.tableJqEls.each(this.proxy(function(a, b) {
                    var c = $(b).attr("datatableId");
                    this.editorTargetDatatableId != c && (c = this.db.query(this.data.datatable[c].defaultQuery), this.tableRenderers[a].select(c))
                }));
                DEBUG && console.log("updateFromSql", isFirstLoad, Date.now() - a)
            }
        }
};
Exercise.prototype.enableContinueButton = function() {
    this.continueJqEl.removeClass("disabled");
    this.continueJqEl.html("Nadaljuj <span>&rsaquo;</span>");
    FOCUS_CONTINUE_BUTTON_ON_COMPLETE && this.continueJqEl.focus()
};
Exercise.prototype.showMessage = function(a, c, b, d) {
    c ? this.messageJqEl.addClass(c) : this.messageJqEl.removeClass("error");
    this.messageJqEl.text(a);
    null != this.messageTimeoutTimer && (clearTimeout(this.messageTimeoutTimer), this.messageTimeoutTimer = null);
    null == this.messageTimeoutTimer && (this.messageTimeoutTimer = setTimeout(this.proxy(function() {
        this.messageJqEl.show(150);
        this.messageTimeoutTimer = b ? setTimeout(this.proxy(function() {
            this.hideMessage();
            this.messageTimeoutTimer = null;
            d && this.proxy(d)()
        }), b) : null
    }), 500))
};
Exercise.prototype.hideMessage = function() {
    null != this.messageTimeoutTimer && (clearTimeout(this.messageTimeoutTimer), this.messageTimeoutTimer = null);
    this.messageJqEl.hide(150)
};

function Task(a, c, b, d, e, f) {
    this.queryChecks = c;
    this.checks = [];
    $.each(b, this.proxy(function(b, c) {
        this.checks.push(new TaskCheck(a, c.type, c.data, c.failQuery, d, c.errorMessage))
    }));
    this.satisfied = !1;
    this.solution = d;
    this.userSolution = e;
    this.postValidateAction = f
}
Task.prototype.proxy = function(a) {
    return $.proxy(a, this)
};
Task.prototype.getUserSolution = function() {
    return this.userSolution ? this.userSolution : this.solution
};
Task.prototype.hasPostValidateAction = function() {
    return null != this.postValidateAction
};
Task.prototype.getPostValidateQuery = function() {
    return this.postValidateAction.resultQuery
};
Task.prototype.getPostValidateMessage = function() {
    return this.postValidateAction.message
};
Task.prototype.getPostValidateActionRunOnce = function() {
    return "runActionOnce" in this.postValidateAction ? this.postValidateAction.runActionOnce : null
};
Task.prototype.isSatisfied = function() {
    return this.satisfied
};
Task.prototype.verify = function(a, c) {
    this.satisfied = !0;
    $.each(this.checks, this.proxy(function(b, d) {
        this.satisfied = this.satisfied && d.verify(a, c)
    }));
    return this.satisfied
};
Task.prototype.verifySqlInput = function(a) {
    if (!this.queryChecks) return !0;
    var c = !0;
    $.each(this.queryChecks, this.proxy(function(b, d) {
        var e = -1 != a.toLowerCase().indexOf(d.toLowerCase());
        c = c && e
    }));
    return c
};

function TaskCheck(a, c, b, d, e, f) {
    this.db = a;
    this.type = c;
    this.data = b;
    this.failQuery = d;
    this.solution = e;
    this.errorMessage = f
}
TaskCheck.prototype.proxy = function(a) {
    return $.proxy(a, this)
};
TaskCheck.prototype.verify = function(a, c) {
    var b = c.rows,
        d = c.columns;
    if ("col_equals" == this.type) {
        if (this.data.length != d.length) return !1;
        var e = !0;
        $.each(this.data, this.proxy(function(a, b) {
            e = e && -1 != $.inArray(b, d)
        }));
        return e
    }
    if ("row_count_query_range" == this.type) {
        var b = this.db.query(this.data.query),
            f = "undefined" !== typeof this.data.maxCount ? this.data.maxCount : 9999999;
        return ("undefined" !== typeof this.data.minCount ? this.data.minCount : 0) <= b.rows.length && b.rows.length <= f
    }
    if ("row_exists_contain_col_val" == this.type) return a = "SELECT * FROM " + this.data.table + " WHERE " + this.data.column + (this.data.ignoreCase ? " LIKE " : " = ") + '"' + this.data.value + '"', b = this.db.query(a), 0 < b.rows.length;
    if ("row_col_val_greather_than_or_equal" == this.type) {
        var l = !0;
        $.each(b, this.proxy(function(a, b) {
            l = l && b[this.data.column_a] >= b[this.data.column_b]
        }));
        return l
    }
    if ("row_col_val_solution_query" == this.type) {
        f = this.db.query(this.solution);
        if (b.length != f.rows.length || d.length < f.columns.length) return;
        for (f = f.rows; 0 < f.length;) {
            for (var h = f.splice(0, 1)[0], m = _.intersection(h._values, h._values), k = !1, g = 0; g < b.length && !k; g++) k = b[g], k = _.intersection(h._values, k._values).length >= m.length;
            if (!k) return !1
        }
        return !0
    }
    if ("row_col_val_solution_query_ordered" == this.type) {
        f = this.db.query(this.solution);
        if (b.length != f.rows.length || d.length < f.columns.length) return;
        f = f.rows;
        for (g = 0; g < f.length; g++)
            if (h = f[g], m = _.intersection(h._values, h._values), k = b[g], _.intersection(h._values, k._values).length < m.length) return !1;
        return !0
    }
    if ("assert_query_succeeds" == this.type) return c = this.db.query(this.data), (b = c.isError()) && this.failQuery && this.db.query(this.failQuery), !b;
    if ("assert_query_fails" == this.type) return c = this.db.query(this.data), c.isError();
    alert("Neveljavni tip: " + this.type);
    return !1
};

function ButtonHoverHelper(a, c, b, d) {
    this.menuJqEl = c;
    this.lessonJqEl = b;
    this.practiceJqEl = d;
    this.lessonMenuVisible = this.menuContainerVisible = !1;
    this.leaveTimeoutTimer = null;
    this.forceOpen = !1;
    a.on("click", this.proxy(this.onBackgroundClick));
    b.on("click", this.proxy(this.onClickLesson));
    b.on("mouseenter", this.proxy(this.onMouseEnterLesson));
    b.on("mouseleave", this.proxy(this.onMouseLeave));
    d.on("click", this.proxy(this.onClickPractice));
    d.on("mouseenter", this.proxy(this.onMouseEnterPractice));
    d.on("mouseleave", this.proxy(this.onMouseLeave));
    c.on("mouseenter", this.proxy(this.onMouseEnterMenu));
    c.on("mouseleave", this.proxy(this.onMouseLeave))
}
ButtonHoverHelper.prototype.proxy = function(a) {
    return $.proxy(a, this)
};
ButtonHoverHelper.prototype.onBackgroundClick = function() {
    this.menuContainerVisible && (this.hideMenuContainer(), this.forceOpen = !1)
};
ButtonHoverHelper.prototype.onClickLesson = function(a) {
    if (this.forceOpen)
        if (this.lessonMenuVisible) this.onBackgroundClick();
        else this.showLessonMenu();
    else this.showLessonMenu(), this.forceOpen = !0;
    a.preventDefault();
    a.stopPropagation()
};
ButtonHoverHelper.prototype.onClickPractice = function(a) {
    if (this.forceOpen)
        if (this.lessonMenuVisible) this.showPracticeMenu();
        else this.onBackgroundClick();
    else this.showPracticeMenu(), this.forceOpen = !0;
    a.preventDefault();
    a.stopPropagation()
};
ButtonHoverHelper.prototype.onMouseEnterLesson = function() {
    this.forceOpen || (null != this.leaveTimeoutTimer && clearTimeout(this.leaveTimeoutTimer), this.showLessonMenu())
};
ButtonHoverHelper.prototype.onMouseEnterPractice = function() {
    this.forceOpen || (null != this.leaveTimeoutTimer && clearTimeout(this.leaveTimeoutTimer), this.showPracticeMenu())
};
ButtonHoverHelper.prototype.onMouseEnterMenu = function() {
    null != this.leaveTimeoutTimer && clearTimeout(this.leaveTimeoutTimer)
};
ButtonHoverHelper.prototype.onMouseLeave = function() {
    this.forceOpen || (null != this.leaveTimeoutTimer && clearTimeout(this.leaveTimeoutTimer), this.leaveTimeoutTimer = setTimeout(this.proxy(this.onLeave), 250))
};
ButtonHoverHelper.prototype.onEnter = function() {
    this.menuJqEl.fadeIn(125, this.proxy(function() {
        this.menuContainerVisible = !0
    }))
};
ButtonHoverHelper.prototype.onLeave = function() {
    this.hideMenuContainer()
};
ButtonHoverHelper.prototype.hideMenuContainer = function() {
    this.menuJqEl.fadeOut(125, this.proxy(function() {
        this.menuJqEl.find(".lesson_menu").hide();
        this.menuJqEl.find(".practice_menu").hide();
        this.menuContainerVisible = !1
    }))
};
ButtonHoverHelper.prototype.showLessonMenu = function() {
    this.menuContainerVisible ? (this.menuJqEl.find(".practice_menu").hide(), this.menuJqEl.find(".lesson_menu").show()) : (this.menuJqEl.find(".lesson_menu").show(), this.onEnter());
    this.lessonMenuVisible = !0
};
ButtonHoverHelper.prototype.showPracticeMenu = function() {
    this.menuContainerVisible ? (this.menuJqEl.find(".lesson_menu").hide(), this.menuJqEl.find(".practice_menu").show()) : (this.menuJqEl.find(".practice_menu").show(), this.onEnter());
    this.lessonMenuVisible = !1
};

function DatatableScrollHelper(a, c, b) {
    this.hoverTimer = null;
    this.hoverDelay = b;
    this.defaultOverflowState = c;
    a.css("overflow-y", c);
    a.on("mouseenter", this.proxy(this.onMouseEnter));
    a.on("mouseleave", this.proxy(this.onMouseLeave))
}
DatatableScrollHelper.prototype.proxy = function(a) {
    return $.proxy(a, this)
};
DatatableScrollHelper.prototype.onMouseEnter = function(a) {
    this.hoverTimer = setTimeout(function() {
        $(a.delegateTarget).css("overflow-y", "scroll")
    }, this.hoverDelay)
};
DatatableScrollHelper.prototype.onMouseLeave = function(a) {
    clearTimeout(this.hoverTimer);
    $(a.delegateTarget).css("overflow-y", this.defaultOverflowState)
};

function updateAceDefinitions() {
    ace.define("ace/mode/sql", "require exports module ace/lib/oop ace/mode/text ace/tokenizer ace/mode/sql_highlight_rules ace/range".split(" "), function(a, c, b) {
        b = a("../lib/oop");
        var d = a("./text").Mode;
        a("../tokenizer");
        var e = a("./sql_highlight_rules").SqlHighlightRules;
        a("../range");
        a = function() {
            this.HighlightRules = e
        };
        b.inherits(a, d);
        (function() {
            this.lineCommentStart = "--";
            this.$id = "ace/mode/sql"
        }).call(a.prototype);
        c.Mode = a
    });
    ace.define("ace/mode/sql_highlight_rules", ["require", "exports", "module", "ace/lib/oop", "ace/mode/text_highlight_rules"], function(a, c, b) {
        b = a("../lib/oop");
        a = a("./text_highlight_rules").TextHighlightRules;
        var d = function() {
            this.$rules = {
                start: [{
                    token: "comment",
                    regex: "--.*$"
                }, {
                    token: "comment",
                    start: "/\\*",
                    end: "\\*/"
                }, {
                    token: "string",
                    regex: '".*?"'
                }, {
                    token: "string",
                    regex: "'.*?'"
                }, {
                    token: "constant.numeric",
                    regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b"
                }, {
                    token: this.createKeywordMapper({
                        "support.function": "count|min|max|avg|sum|rank|now|coalesce",
                        keyword: "alter|table|add|column|float|integer|boolean|double|real|character|varchar|date|datetime|blob|primary|key|autoimcrement|unique|not|null|foreign|default|select|distinct|like|insert|update|delete|from|where|and|or|group|by|order|limit|offset|having|as|case|when|else|end|type|left|right|join|on|inner|outer|desc|asc|into|values|set",
                        "constant.language": "true|false|null"
                    }, "identifier", !0),
                    regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b"
                }, {
                    token: "keyword.operator",
                    regex: "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|="
                }, {
                    token: "paren.lparen",
                    regex: "[\\(]"
                }, {
                    token: "paren.rparen",
                    regex: "[\\)]"
                }, {
                    token: "text",
                    regex: "\\s+"
                }]
            };
            this.normalizeRules()
        };
        b.inherits(d, a);
        c.SqlHighlightRules = d
    })
}

function initializeDocumentLoad(a, c) {
    GA_PAGE_KEY = c;
    new ButtonHoverHelper($("body"), $(".menu_container"), $(".lesson_button"), $(".topics_button"));
    ALLOW_SCROLL_RO_DATATABLES && !Modernizr.touchevents && new DatatableScrollHelper($(".datatable.read_only"), "hidden", 500);
    $(".lesson .body code[class=sql]").each(function(a, b) {
        hljs.highlightBlock(b)
    });
    var b = "undefined" === typeof disableExercises;
    if (a && b) {
        if (DEBUG) var d = Date.now();
        var e = new Db(dbData),
            f = JSON.parse(a);
        $(".exercise").each(function(a, b) {
            (new Exercise($(b), e, f)).initialize()
        });
        f = e = null;
        DEBUG && console.log("Building Exercise", Date.now() - d)
    } else b || ($(".exercise").hide(), $(".disabled_exercise_overlay").show())
}