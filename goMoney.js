#!/usr/bin/gjs
const Gtk = imports.gi.Gtk;
const Glib = imports.gi.GLib;

Gtk.init(null, 0);

let Builder = new Gtk.Builder();
Builder.add_from_file('gomoney.glade');

let win = Builder.get_object('wBudgetApp'); 
//win.set_default_size(500, 300); // lets try our old hint ))

//let btn = Builder.get_object('okBtn');
//btn.connect('clicked', function(){
//	print('Thanx for click me');
//});

win.connect('destroy', function(){
	Gtk.main_quit();
});

//let store = Builder.get_object('transStore');
let sel = Builder.get_object('wordsSelection');
//
//selection.connect('changed', function(){
//	let [isSelected, model, iter] = selection.get_selected();
//	print(store.get_value(iter, 0));
//});

// global widgets

let wMenuQuit = Builder.get_object('wMenuQuit');
let m_wCatMajEntry  = Builder.get_object('wCatMajEntry');
let m_wCatMinEntry  = Builder.get_object('wCatMinEntry');
let m_wDateEntry = Builder.get_object('wEntryDate');
let m_wAmountEntry =  Builder.get_object('wEntryAmount');
let m_wCommentsText = Builder.get_object('wTextComments');
let m_wDateSelector = Builder.get_object('wCalendarSelector');
let m_wAddButton =  Builder.get_object('wAddButton');
let m_wTBSaveButton = Builder.get_object('wTBSaveButton');
let m_wMenuSave = Builder.get_object('wMenuSave');
let m_wMenuSaveAs = Builder.get_object('wMenuSaveAs');
let m_wMenuOpen = Builder.get_object('wMenuOpen');
let m_wMenuNew = Builder.get_object('wMenuNew');
let m_wMenuAbout = Builder.get_object('wMenuAbout');
let m_wRecentFiles = Builder.get_object('wRecentFiles');
let m_wMenuHelp = Builder.get_object('wMenuHelp');
let m_wMenuExample = Builder.get_object('wMenuExample');
let m_wTBOpen = Builder.get_object('wTBOpen');
let m_wTBNew = Builder.get_object('wTBNew');
let m_wMainWin = Builder.get_object('wBudgetApp');
let m_wMainReplace = Builder.get_object('wMainReplace');
let m_wMainDelete = Builder.get_object('wMainDelete');
let m_wMainSort = Builder.get_object('wMainSort');
let m_wResultsCatWindow = Builder.get_object('wResultsCatWindow');
let m_wResultsDateLow = Builder.get_object('wResultDateLow');
let m_wResultsDateHigh = Builder.get_object('wResultDateHigh');
let m_wResultsWindow = Builder.get_object('wResultsWindow');
let m_wResultsApply = Builder.get_object('wResultsApply');
let m_wTotalSpent = Builder.get_object('wTotalSpent');
let m_wResultsAllCategories = Builder.get_object('wResultsAllCategories');
let m_wAmountBudgeted = Builder.get_object('wAmountBudgeted');
let m_wDDExpended = Builder.get_object('wDDExpended');
let m_wDDBudgeted = Builder.get_object('wDDBudgeted');
let m_wSortDates = Builder.get_object('wSortDates');
let m_wNoteBook = Builder.get_object('wNoteBook');
let m_wTBExportAbi = Builder.get_object('wExportAbi');
let m_wTBExportGnumeric = Builder.get_object('wExportGnumeric');
let m_wMenuExportAbi = Builder.get_object('wMenuExportAbiWord');
let m_wMenuExportGnumeric = Builder.get_object('wMenuExportGnumeric');

// Budget Tab widgets

let m_wBudReplace = Builder.get_object('wBudgetReplace');
let m_wBudSort = Builder.get_object('wBudgetSort');
let m_wBudAdd = Builder.get_object('wBudgetAdd');
let m_wBudDelete = Builder.get_object('wBudgetDelete');
let m_wBudNew = Builder.get_object('wBudgetNew');

let m_wBudMajEntry = Builder.get_object('wBudgetMajCat');
let m_wBudSubCatEntry = Builder.get_object('wBudgetSubCat');
let m_wBudYearlyEntry = Builder.get_object('wBudgetYearlyBudget');
let m_wBudNumSchedSpin = Builder.get_object('wNumSchedSpin');
let m_wBudDateFirstEntry = Builder.get_object('wBudgetDateFirst');
let m_wBudChooseFirstDateButton = Builder.get_object('wBudgetChooseFirstDate');
let m_wBudCashOrDDEntry = Builder.get_object('wBudgetCashOrDirectDebit');

let m_wBudYearTotalEntry = Builder.get_object('wBudgetYearTotal');
let m_wBudDDTotalEntry = Builder.get_object('wBudgetDDTotal');
let m_wBudDDTargetDateEntry = Builder.get_object('wBudgetDDTargetDate');
let m_wBudChooseDDTargetButton = Builder.get_object('wBudgetDDChoose');
let m_wBudTargetNeededEntry = Builder.get_object('wBudgetDDAtDate');

let m_wBudgetWindow = Builder.get_object('wBudgetWindow');

// Direct Debit Tab widgets

let m_wDDDateChosenEntry = Builder.get_object('wDDDateChosenEntry');
let m_wDDCalendar = Builder.get_object('wDDCalendar');
let m_lbDDResults = Builder.get_object('lbDDResults');
let m_wDDWindow = Builder.get_object('wDDWindow');

///////////////////////////////////////////////

/**
 * OS Detection Code based on path handling, also sets
 * directory/path delimiters in pDelim (use instead
 * of slashes in paths passed through buildPath) - RP 20040603
 */ 
function osDetect()
{
    testpath = '/dev';
    isTWin = FALSE;
    if (!os.path.isdir(testpath))
        isTWin = TRUE;
    return isTWin;
}

function findPrefix()
{
    cwd=os.getcwd();
    intPrefix=cwd;
    if (debugMsgs)
        print('RP: CWD='+cwd);
    lCwd=len(cwd);
    if (lCwd==0)
    {
        print('RP:  This is bad.  Working directory not found, cannot generate prefix.  May die unexpectedly, fix this!');
        intPrefix='D:\\Program Files';
        valid=FALSE;
    }
    else
    {
        if (debugMsgs)
        {
            //print('RP: CWD Test 1: ' + string.upper(cwd[lCwd-8:]));
            //print('RP: CWD Test 2: ' + string.upper(cwd[lCwd-9:lCwd-1]));
        }
//        if (string.upper(cwd[lCwd-8:])=='MYBUDGET')
//            intPrefix=cwd[:lCwd-9];
//        if (string.upper(cwd[lCwd-9:lCwd-1])=='MYBUDGET')
//            intPrefix=cwd[:lCwd-10];
        valid=TRUE;
    }
    if (debugMsgs)
        print('RP: Working Directory: '+intPrefix);
    return intPrefix;
}

    
function findAbiWord()
{
    for (item in sPaths)
    {
        abi = item+pDelim+'AbiWord-2.2';
        if (os.path.isfile(abi))
            return 'AbiWord-2.2';
    }
    for (item in sPaths)
    {
        abi = item+pDelim+'abiword-2.2';
        if (os.path.isfile(abi))
            return 'abiword-2.2';
    }
    for (item in sPaths)
    {
        abi = item+pDelim+'abiword-2.0';
        if (os.path.isfile(abi))
            return 'abiword-2.0';
    }
    return None;
}
        
function findLinuxBrowser()
{
// epiphany
    for (item in sPaths)
    {
        sweb = item+pDelim+'epiphany';
        if (os.path.isfile(sweb))
            return 'epiphany';
    }
// firefox
    for (item in sPaths)
    {
        sweb = item+pDelim+'firefox';
        if (os.path.isfile(sweb))
            return 'firefox';
    }
// galeon
    for (item in sPaths)
    {
        sweb = item+pDelim+'galeon';
        if (os.path.isfile(sweb))
            return 'galeon';
    }
// mozilla
    for(item in sPaths)
    {
        sweb = item+pDelim+'mozilla';
        if (os.path.isfile(sweb))
            return 'mozilla';
    }
// konqueror
    for (item in sPaths)
    {
        sweb = item+pDelim+'konqueror';
        if (os.path.isfile(sweb))
            return 'konqueror';
    }

// netscape
    for (item in sPaths)
    {
        sweb = item+pDelim+'netscape';
        if (os.path.isfile(sweb))
            return 'netscape';
    }
    return None;
}

function buildPath(str)
{
    spath = sPREFIX+pDelim+pDelim+str;
//    'goMoney'+
    return spath;
}

/**
 * The idle timeout handler to destroy the splashscreen
 */
function destroySplash(splashScreen)
{
    splashScreen.destroy();
    return FALSE;
}
/**
 * Trim leading trailing spaces
 */
function trimString(s)
{
    i = 0;
    len_s = len(s);
    if (len_s == 0)
        return s;
    j = len_s-1;
    while ((s[i] == ' ') && (i < len_s-1))
    {
        i = i +1;
    }
    while (((s[j]== ' ') || (s[j] == '\n')) && (j >= 0))
    {
        j = j - 1;
    }
//    if(j<0)
//        return s[0:0];
//    return s[i:j+1];
    return ''; // STUB
}
/**
 * Convert a floating point number to a string with a leading dollar sign
 */
function floatToStr(f)
{
    iV = 0;
    fV = f*100.0+0.499999;
    iV = fV;
    ff = iV;
    ff = ff/100.0;
    str = "%10.2f" % ff;
    str = trimString(str);
    str = '$'+str;
    return str;
}

function floatNoDollar(f)
{
    iV = 0;
    fV = f*100.0+0.499999;
    iV = fV;
    ff = iV;
    ff = ff/100.0;
    str = "%10.2f" % ff;
    str = trimString(str);
    return str;
}


function RecentFiles()
{
    //"""Transperently handles recent files via config info"""

    function __init__(self,numRecent,isWin,wRecentMenu)
	{
        self.m_iRecent = 0;
        self.m_isWin = isWin;
        self.m_MaxRecent = numRecent;
        self.m_RecentStack =[''];
        self.m_wRecentMenuBase = wRecentMenu;

// Now fill a recent file stack from config info

        if ((!self.m_isWin) && (self.m_MaxRecent > 0))
        {
            base_key = '/apps/myBudget/Recent_';
            key = base_key + '1';
            first = m_GConfClient.get_string(key);
            if (first != None)
            {
                self.m_RecentStack = [first];
                self.m_iRecent = 1;
                i = 2;
                while (i <= numRecent)
                {
                    key = base_key + ('%d' % i);
//                    print 'Attempting to retrieve key ',key;
                    first =  m_GConfClient.get_string(key);
//                   print ' Got ',first;
                    if (first == None)
                        break;
                    self.m_RecentStack.append(first);
                    self.m_iRecent += 1;
                    i += 1;
                }
            }
        }
        self.buildRecentMenu();
        return;
   } 
   function onRecent_cb(self,me)
   {
        if (m_iDirty > 0)
        {
            res = querySave();
            if (res == gtk.RESPONSE_REJECT)
                return;
        }
        newFile = me.get_data('myName');
        doOpenFile(newFile);
        return;
    }
    function buildRecentMenu(self)
   	{
        iSize = len(self.m_RecentStack);
        self.m_wRecentMenu = gtk.Menu();
        self.m_wRecentMenuBase.set_submenu(self.m_wRecentMenu);
        for (var i in range(iSize))
    	{
            wMenuItem = gtk.MenuItem(self.getNthRecentShort(i+1));
            wMenuItem.set_data('myName',self.getNthRecent(i+1));
            self.m_wRecentMenu.append(wMenuItem);
            wMenuItem.connect('activate',self.onRecent_cb);
    	}
        self.m_wRecentMenu.show_all();
        return;
    }
    function getNumRecent(self)
    {
        return self.m_iRecent;
    }
    function getMaxRecent(self)
    {
        return self.m_MaxRecent;
    }
    function getNthRecentShort(self,nth)
    {
        if (nth > self.m_iRecent)
            return None;
        short = self.m_RecentStack[nth-1];
        ishort = len(short);
        i = ishort-1;
        while ((i >= 0) && (short[i] != pDelim))
        {
            i = -1;
        }
        if (i < 0)
            return short;
//        print ' shortened = ',short[i,ishort];
        return short[i,ishort];
    }
    function getNthRecent(self,nth)
    {
        if (nth > self.m_iRecent)
            return None;
        return self.m_RecentStack[nth-1];
    };
    
    function pushRecent(self,sNewRecent)
    {
// Look for pre-existing recent file

//        print 'pushRecent file ',sNewRecent
        i = 0;
        for (var sRecent in self.m_RecentStack)
        {
            if ((sRecent == sNewRecent) && (i != 0))
            {
                self.m_RecentStack.remove(self.m_RecentStack[i]);
                break;
            }
            else if ((sRecent == sNewRecent) && (i == 0))
                return;
            else
                i += 1;
    	}
        self.m_RecentStack.insert(0,sNewRecent);
        self.m_iRecent = len(self.m_RecentStack);
        while (self.m_iRecent > self.m_MaxRecent)
        {
            self.m_RecentStack.remove(self.m_RecentStack[self.m_iRecent-1]);
            self.m_iRecent -= 1;
        }
        if (!self.m_isWin)
        {
            base_key = '/apps/myBudget/Recent_';
            i = 0;
            for (var item in self.m_RecentStack)
            {
                j = i+1;
                key = base_key + ('%d' % j);
                m_GConfClient.set_string(key,item);
 //               print 'saving ith ',i,' key ',key,' value ',item;
                i += 1;
            }
        }
        self.m_iRecent = len(self.m_RecentStack);
        self.m_wRecentMenu.destroy();
        self.buildRecentMenu();
        return;
     }
};

/**
 * Read in the category file && build our categy data structure
 */
function readCategories(fileModel)
{
    if (fileModel == '')
        inCat = open(buildPath('generic-budget.txt'),'r')
    else
    {
        inCat = open(fileModel,'r');
        m_RecentFiles.pushRecent(fileModel);
    }
    inCatStrs = inCat.readlines();
    allFrags = [['','','','','',''],['','','','','','']];
    j = 0;
    for (var s in inCatStrs)
    {
//        print 'string is ',s
//        if (s[:6] == '======')
//            break;
        frags = string.split(s,':');
        i = 0;
        for (var ss in frags)
        {
            frags[i] = trimString(ss);
            i = i + 1;
        }
//        print ' frags are ',frags
        if (j < 2)
            allFrags[j] = frags;
        else
        {
            allFrags.append(frags);
//        print ' j ',j, allFrags[j];
        }
        j = j +1;
    }
    inCat.close();
    return allFrags;
}    

function addDollar(str)
{
    s = trimString(str);
    i = 0;
    len_s = len(s);
    if (len_s == 0)
        return s;
    if (s[0] != '$')
        ss = '$' + s;
    else
        ss = s;
    return ss;
}

/**
 * Convert a text string of the form "day/month/year" eg 03/04/02 to an
 * interger number which is the number of days since Jan 1st, 2000. Assume
 * month ==1 => January
 */ 
function daysFromDate(str)
{
    s = trimString(str);
//    print "Date String is ",s;
    myDay,myMon,myYear = string.split(s,'/');
    iYear = string.atoi(myYear);

// Jan == Month 1

    iMon = string.atoi(myMon)-1; 
    iDay = string.atoi(myDay);
    iYear = iYear -2000;
    iYearDays = iYear*365;
    iExtra = 0;
    iExtra = iYear/4;
    iYearDays = iYearDays+iExtra;
    iLeap = iYear/4;
    if (iLeap*4 == iYear)
        iLeap = 1;
    else
        iLeap = 0;
    monDays = 0;
    i = 0;
    for (var mon in m_monthDays)
    {
        monDays = monDays + mon;
        if ((mon == 28) && (iLeap == 1))
            monDays = monDays + 1;
        if (i== iMon)
            break;
        i = i + 1;
    }
    iYearDays = iYearDays + monDays + iDay;
    return iYearDays;
}

/**
 * Convert the number of days since Jan 1, 2000 to a date string
 * month ==1 => January
 */ 
function dateFromDays(iDays)
{
    totDays = 0;
    prevDays = 0;
    iYear = 2000;
    iLeapCount = 0;
    while (totDays < iDays)
    {
        iYear += 1;
        iLeapCount += 1;
        prevDays = totDays;
        totDays += 365;
        iLeap = 0;
        if (iLeapCount == 4)
        {
            iLeapCount = 0;
            iLeap = 1;
            totDays += 1;
        }
	}
    iYear -= 1;
    iDays -= prevDays;
    iCount = 1;
    for (var mon in m_monthDays)
    {
        prevDays = iDays;
        iDays -= mon;
        if ((mon == 28) && (iLeap == 1))
            iDays -= 1;
        if (iDays <= 0)
            break;
        iCount += 1;
    }
    iDays = prevDays;
    sDate = '%d/%d/%d' % (iDays,iCount,iYear);
    return sDate;
}
        
/**
 * Convert a string with an optional leading '$" o a floating point number
 */
function dollarToFloat(str)
{
//    s = trimString(str);
//    if (s[0] == '$')
//        ss = s[1:];
//    else
        ss = s;
    fl = string.atof(ss);
    return fl;
}

/**
 * Build a category Model from a pre-existing Budget contained in
 * the glocal m_allItems
 */
function buildCategoryModel()
{
    store = gtk.TreeStore(gobject.TYPE_STRING,
                          gobject.TYPE_INT,
                          gobject.TYPE_INT,
                          gobject.TYPE_INT);

// Start model here

    outer = 0;
    inner = 0;
    index  = 0;
    item = m_allItems[0];
    prevOuter = item[0];
    iter = store.append(None);
    store.set(iter, 0, item[0],
              1, outer,
              2,inner,
              3,index);
    outer = outer + 1;
    index = index + 1;
    for (item in m_allItems)
    {
    	if(len(item) < 3)
            break;
        if (item[0] != prevOuter)
        {
            inner = 0;
            iter = store.append(None);
            store.set(iter, 0, item[0],
                      1, outer,
                      2,inner,
                      3,index);
//            prevOuter = prevOuter[0:0] + item[0];
            outer = outer + 1;
        }
        nitem = item[1];
//        print 'appending ',nitem,' in ',item[0],' \n';
        inner = inner + 1;
        citer = store.append(iter);
        store.set(citer,0,nitem,
                  1,outer,
                  2,inner,
                  3,index);
        index = index + 1;
    }
    return store;
}

/**
 * Create a Category Model from a file containing
 * budget or a default budget if fileModel is None
 */ 
function create_model(fileModel)
{
    m_allItems = readCategories(fileModel);
    store = buildCategoryModel();
    return store;
}

/**
 * Create a Category Tree in the Main window from a file containing
 * budget or a default budget if fileModel is None
 */
function createCategoryTree(fileModel)
{
    catmodel = create_model(fileModel);
    catwin = m_pXML.get_widget('catWindow');
    catTree = gtk.TreeView(catmodel);
    catTree.set_rules_hint(TRUE);
    column = gtk.TreeViewColumn(_('Categories'), gtk.CellRendererText(),
                                 text=0);
    catTree.append_column(column);
    catwin.add(catTree);
    catwin.show_all();
    return catTree;
}


///////////////////////////////////////////////
/**
 * Rebuild the Category Tree in the Main window from a pre-existing
 * m_allItems
 */ 
function rebuildCategoryTree()
{
    catmodel = buildCategoryModel();
    catwin = m_pXML.get_widget('catWindow');
    catTree = gtk.TreeView(catmodel);
    catTree.set_rules_hint(TRUE);
    column = gtk.TreeViewColumn(_('Categories'), gtk.CellRendererText(),
                                 text=0);
    catTree.append_column(column);
    catwin.add(catTree);
    catwin.show_all();
    return catTree;
}

/**
 * Callback functioin to tell us if there is an active selection
 * in the results category window
 */
function onResultsCatSelected_cb(me)
{
	m_iResultsCatSelected = 1;
}


/**
 * Create a Category Tree in the Results window from a file containing
 * budget or a default budget if fileModel is None  
 */
function createResultsCategoryTree(fileModel)
{
	catmodel = create_model(fileModel);
    catwin = m_wResultsCatWindow;
    catTree = gtk.TreeView(catmodel);
    catTree.set_rules_hint(TRUE);
    column = gtk.TreeViewColumn(_('Categories'), gtk.CellRendererText(),
                                 text=0);
    catTree.append_column(column);
    catwin.add(catTree);
    catwin.show_all();
    return catTree;
}

/**
 * Rebuild the Category Tree in the Results window from a pre-existing
 * m_allItems
 */
function rebuildResultsCategoryTree()
{

    if (m_wResultsCategoryTree != None)
        m_wResultsCategoryTree.destroy();
    catmodel = buildCategoryModel();
    catwin = m_wResultsCatWindow;
    catTree = gtk.TreeView(catmodel);
    catTree.set_rules_hint(TRUE);
    column = gtk.TreeViewColumn(_('Categories'), gtk.CellRendererText(),
                                 text=0);
    catTree.append_column(column);
    catwin.add(catTree);
    catwin.show_all();
    return catTree;
}

/**
 * Create the record Tree from the given input file
 */
function buildRecordTree(newFile)
{
    m_iNumRecords = 0;
    store = gtk.TreeStore(gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING);
    recwin = m_pXML.get_widget('wRecordWindow');
    recTree = gtk.TreeView(store);
    recTree.set_rules_hint(TRUE);
    sel = recTree.get_selection();
    sel.set_mode (gtk.SELECTION_MULTIPLE);
    column = gtk.TreeViewColumn(_('Category  '), gtk.CellRendererText(),
                                 text=0);
    recTree.append_column(column);
    column = gtk.TreeViewColumn(_('Sub Category  '), gtk.CellRendererText(),
                                 text=1);
    recTree.append_column(column);
    column = gtk.TreeViewColumn(_('Date '), gtk.CellRendererText(),
                                 text=2);
    recTree.append_column(column);
    column = gtk.TreeViewColumn(_('Amount '), gtk.CellRendererText(),
                                 text=3);
    recTree.append_column(column);
    column = gtk.TreeViewColumn(_('Comments '), gtk.CellRendererText(),
                                 text=4);
    recTree.append_column(column);
    recwin.add(recTree);
    recwin.show_all();
    TreeStore = recTree.get_model();
    if (newFile != '')
    {
        m_RecentFiles.pushRecent(newFile);
        m_sCurrentFile = newFile;
        m_wMainWin.set_title('MyBudget - '+newFile);
        nFile = open(newFile,'r');
        inFileStrs = nFile.readlines();
        allFrags = [['','','','',''],['','','','','']];
        j = 0;
        skip = 0;
        for (var s in inFileStrs)
        {
//            if (s[:6] == '======')
//            {
//                skip = 1;
//                continue;
//            }
            if (skip == 0)
                continue;
            frags = string.split(s,':');
            i = 0;
            for (var ss in frags)
            {
                frags[i] = trimString(ss);
                i = i + 1;
            }
            if (j < 2)
                allFrags[j] = frags;
            else
                allFrags.append(frags);
            f = dollarToFloat(frags[3]);
            s = floatToStr(f);
            TreeStore.append(None,(frags[0],frags[1],frags[2],s,frags[4]));
            j = j +1;
        }
        nFile.close();
        m_allRecords = allFrags;
        m_iNumRecords = j;
    }
    return recTree;
}
function chooseFile(sFile)
{
    response = gtk.RESPONSE_CANCEL;
    wFileSel = gtk.FileSelection('Choose File');
    wFileSel.show_fileop_buttons();
    if (sFile != '')
        wFileSel.set_filename(sFile);
    response = wFileSel.run();
    if (response == gtk.RESPONSE_CANCEL)
        m_sCurrentFile = "";
    else
        m_sCurrentFile = wFileSel.get_filename();
    wFileSel.destroy();
    return m_sCurrentFile;
}

function chooseExportFile(sFile)
{
    response = gtk.RESPONSE_CANCEL;
    wFileSel = gtk.FileSelection('Choose File');
    wFileSel.show_fileop_buttons();
    if (sFile != '')
        wFileSel.set_filename(sFile);
    response = wFileSel.run();
    if (response == gtk.RESPONSE_CANCEL)
        sExpFile = "";
    else
        sExpFile = wFileSel.get_filename();
    wFileSel.destroy();
    return sExpFile;
}
function saveToFile(sFile)
{
    m_iDirty = 0;
    fFile = open(sFile,'w');
    m_wMainWin.set_title('MyBudget - '+sFile);
    for (var item in m_allItems)
    {
        line=  item[0] + ' : ' + item[1] + ' : ' + item[2] + ' : ' + item[3] + ' : ' + item[4] + ' : ' + item[5]+'\n';
        fFile.write(line);
    }
    fFile.write('=================================================== \n');
    if (len(m_allRecords) > 0)
    {
        for(var jtem in m_allRecords)
        {
            if (jtem[0] == '')
                continue;
            line=  jtem[0] + ' : ' + jtem[1] + ' : ' + jtem[2] + ' : ' + addDollar(jtem[3]) + ' : ' + jtem[4] + '\n';
            fFile.write(line);
        }
	}
    fFile.close();
}
function ActuallySave()
{
    if (m_iDirty == 0)
        return;
    if (m_sCurrentFile == '')
        m_sCurrentFile = chooseFile('');
    if (m_sCurrentFile == '')
       return;
    saveToFile(m_sCurrentFile);
    m_RecentFiles.pushRecent(m_sCurrentFile);
    m_wMainWin.set_title('MyBudget - '+m_sCurrentFile);
}

function on_Save_cb(me)
{
    ActuallySave();
}

function on_SaveAs_cb(me)
{
    m_sCurrentFile = chooseFile(m_RecentFiles.getNthRecent(1));
    if (m_sCurrentFile != "")
    {
        saveToFile(m_sCurrentFile);
        m_RecentFiles.pushRecent(m_sCurrentFile);
        m_wMainWin.set_title('MyBudget - '+m_sCurrentFile);
    }
    return;
}

/**
 * Update the record tree on a change of name in the Budget
 */ 
function updateRecordTree(budgetItem)
{
    newMaj = budgetItem[0];
    newMin = budgetItem[1];
    oldMaj = m_LastBudgetRecord[0];
    oldMin = m_LastBudgetRecord[1];
//    print "Changing major ",oldMaj," minor ",oldMin;
    icount = -1;
    for (var recItem in m_allRecords) 
    {
        icount = icount +1;
        if (recItem[0] != oldMaj)
            continue;
        if (recItem[1] != oldMin)
            continue;
//        print "found it!";
//        print "changing ", m_allRecords[icount][0],m_allRecords[icount][1];
        m_allRecords[icount][0] = newMaj;
        m_allRecords[icount][1] = newMin;
    }
// Now rebuild the Record Tree from this new data
    m_wRecordTree.destroy();
    rebuildRecordTree();
}    
function on_MainReplace_cb(me)
{
    m_iDirty = 1;
    TreeStore = m_wRecordTree.get_model();
    catMaj = m_wCatMajEntry.get_text();
    catMin = m_wCatMinEntry.get_text();
    dateText = m_wDateEntry.get_text();
    amountText = addDollar(m_wAmountEntry.get_text());
    commentBuffer = m_wCommentsText.get_buffer();
    commentStart = commentBuffer.get_start_iter();
    commentEnd = commentBuffer.get_end_iter();
    commentText = commentBuffer.get_text(commentStart,commentEnd,FALSE);
    if (m_iEditCurrent >= 0)
    {
        m_allRecords[m_iEditCurrent] =  [catMaj,catMin,dateText,amountText,commentText];
        treeIter = TreeStore.insert_before(None,m_EditIter,(catMaj,catMin,
                                          dateText,amountText,commentText));
        treePath = TreeStore.get_path(treeIter);
        TreeStore.remove(m_EditIter);
        m_wRecordTree.scroll_to_cell(treePath);
    }
}        
function on_AddButton_cb(me)
{
    m_iDirty = 1;
    TreeStore = m_wRecordTree.get_model();
    catMaj = m_allItems[m_iCurrentCatIndex][0];
    catMin = m_allItems[m_iCurrentCatIndex][1];
    dateText = m_wDateEntry.get_text();
    amountText = addDollar(m_wAmountEntry.get_text());
    commentBuffer = m_wCommentsText.get_buffer();
    commentStart = commentBuffer.get_start_iter();
    commentEnd = commentBuffer.get_end_iter();
    commentText = commentBuffer.get_text(commentStart,commentEnd,FALSE);

    treeIter = TreeStore.append(None,(catMaj,catMin,
                                          dateText,amountText,commentText));
    treePath = TreeStore.get_path(treeIter);
    if (m_iNumRecords < 2)
        m_allRecords[m_iNumRecords] = [catMaj,catMin,dateText,amountText,commentText];
    else 
        m_allRecords.append([ catMaj,catMin,dateText,amountText,commentText]);
    m_iNumRecords = m_iNumRecords + 1;
    m_wRecordTree.scroll_to_cell(treePath);
}

function on_mainQuit_cb(me)
{
    gtk.main_quit();
}

function daySelected_cb(me)
{
    let [year, month, day] = m_wDateSelector.get_date();
    str = "%d/%d/%d" % (day,month+1,year);
    m_wDateEntry.set_text(str);
}

function getResultLow()
{
    let [year, month, day] = m_wResultsDateLow.get_date();
    str = "%d/%d/%d" % (day,month+1,year);
    m_iResultDateLow = daysFromDate(str);
//    print ' Low days is ',m_iResultDateLow;
}    
function on_ResultLow_cb(me)
{
    getResultLow();
}

function getResultHigh()
{
    let [year, month, day] = m_wResultsDateHigh.get_date();
    str = "%d/%d/%d" % (day,month+1,year);
    m_iResultDateHigh = daysFromDate(str);
//    print ' High date is ',m_iResultDateHigh
}

function on_ResultHigh_cb(me)
{
    getResultHigh()
}

function catTreeSelection_cb(selection)
{
    selection = selection.get_selected();
    if (!selection)
        return;
    model, iter = selection;
    item_str = model.get_value(iter,0);
    item_outer = model.get_value(iter,1);
    item_inner = model.get_value(iter,2);
    item_index = model.get_value(iter,3) -1;
    m_iCurrentCatIndex = item_index;
//    print 'selected item ',item_str,' outer index ',item_outer,' inner index ',item_inner,' Total index ',item_index;
//    str = m_allItems[item_index][0] + ' - ' + m_allItems[item_index][1];
//    print ' selected cat is ',str;
//    print 'Current Cat index is ',m_iCurrentCatIndex;
    m_wCatMajEntry.set_text(m_allItems[item_index][0] );
    m_wCatMinEntry.set_text(m_allItems[item_index][1] );
}    

function querySave()
{
    response = gtk.RESPONSE_NO;
    if (m_iDirty == 0)
        return response;
    qSave = gtk.Dialog("Query Save",
                     m_wMainWin,
                     gtk.DIALOG_MODAL | gtk.DIALOG_DESTROY_WITH_PARENT,
                     (gtk.STOCK_SAVE, gtk.RESPONSE_APPLY,
                      gtk.STOCK_NO, gtk.RESPONSE_NO,
                      gtk.STOCK_CANCEL, gtk.RESPONSE_REJECT));
    vbox = qSave.vbox;
    label = gtk.Label(_('The current document has not been saved.\n If you do not save now some changes will be lost. \n Do you wish to save your document now?'));
    vbox.add(label);
    qSave.show_all();
    response = qSave.run();
    qSave.destroy();
    if (response == gtk.RESPONSE_APPLY)
        ActuallySave();
    return response;
}

function saveAndQuit_cb(me)
{
    response =  querySave();
    if (response == gtk.RESPONSE_REJECT)
        return;
    on_mainQuit_cb(me);
}
    
function SaveAndQuit()
{
    response = querySave();
    if (response == gtk.RESPONSE_REJECT)
        return;
    gtk.main_quit();
}

function cleanBudget()
{
    m_wRecordTree.destroy();
    m_wCategoryTree.destroy();
    m_wBudgetTree.destroy();
    m_wResultsCategoryTree.destroy();
}    

function on_New_cb(me)
{
    if (m_iDirty > 0)
    {
        res = querySave();
        if (res == gtk.RESPONSE_REJECT)
            return;
    }
    cleanBudget();
    m_wCategoryTree = createCategoryTree('');
    m_wResultsCategoryTree = createResultsCategoryTree('');
    sel = m_wCategoryTree.get_selection();
    sel.set_mode (gtk.SELECTION_BROWSE);
    sel.connect('changed',catTreeSelection_cb);
    sel2 = m_wResultsCategoryTree.get_selection();
    sel2.set_mode(gtk.SELECTION_MULTIPLE);
    sel2.connect('changed',onResultsCatSelected_cb);
    m_iResultsCatSelected = 0;
    m_wRecordTree = buildRecordTree('');
    m_wBudgetTree = buildBudgetTree();
    sel3 = m_wBudgetTree.get_selection();
    sel3.set_mode (gtk.SELECTION_BROWSE);
    sel3.connect('changed',budgetTreeSelection_cb);
    sel4 = m_wRecordTree.get_selection();
    sel4.set_mode (gtk.SELECTION_BROWSE);
    sel4.connect('changed',recordTreeSelection_cb);
}

/**
 * Read in a new Budget && record file
 * @param me
 * @returns
 */
function on_Open_cb(me)
{
 //    print ' Open button pressed '
    if (m_iDirty > 0)
    {
        res = querySave();
        if (res == gtk.RESPONSE_REJECT)
            return;
	}
    sPrevPath = m_RecentFiles.getNthRecent(1);
    if (sPrevPath != None)
        sPrevPath = getPathOnly(sPrevPath);
    if (sPrevPath != None)
        newFile = chooseFile(sPrevPath);
    else
        newFile = chooseFile('');
    if (newFile == "")
        return;
    doOpenFile(newFile);
    return;
}

/**
 * Actually read it in now
 */
function doOpenFile(newFile)
{
    m_wMainWin.set_title('MyBudget - '+newFile);
    cleanBudget();
    m_wCategoryTree = createCategoryTree(newFile);
    m_wResultsCategoryTree = createResultsCategoryTree(newFile);
    sel = m_wCategoryTree.get_selection();
    sel.set_mode (gtk.SELECTION_SINGLE);
    sel.connect('changed',catTreeSelection_cb);
    sel2 = m_wResultsCategoryTree.get_selection();
    sel2.set_mode(gtk.SELECTION_MULTIPLE);
    sel2.connect('changed',onResultsCatSelected_cb);
    m_iResultsCatSelected = 0;
    m_iResultsAllCatsChosen = 0;
    m_wRecordTree = buildRecordTree(newFile);
    m_wBudgetTree = buildBudgetTree();
    sel3 = m_wBudgetTree.get_selection();
    sel3.set_mode (gtk.SELECTION_BROWSE);
    sel3.connect('changed',budgetTreeSelection_cb);
    sel4 = m_wRecordTree.get_selection();
    sel4.set_mode (gtk.SELECTION_BROWSE);
    sel4.connect('changed',recordTreeSelection_cb);
}     

/**
 *  Delete the currently selected record
 */
function on_MainDelete_cb(me)
{
	
    treePath,Col = m_wRecordTree.get_cursor();
    if (treePath == None)
        return;
    treeModel = m_wRecordTree.get_model();
    iDeleteRow = treePath[0];
    deleteIter = treeModel.get_iter(treePath);
    treeModel.remove(deleteIter);
    delete m_allRecords[iDeleteRow];
}

function onResultsAllCats_cb(me)
{
    if (m_iResultsAllCatsChosen == 0)
    {
        if (m_wResultsAllCategories.get_active() == TRUE)
        {
            sel = m_wResultsCategoryTree.get_selection();
            sel.select_all();
            m_iResultsAllCatsChosen = 1;
            m_iResultsCatSelected = 0;
        }
	}
    else
    {
        if (m_wResultsAllCategories.get_active() == FALSE)
        {
            m_iResultsAllCatsChosen = 0;
            if (m_iResultsCatSelected == 0)
            {
                sel = m_wResultsCategoryTree.get_selection();
                sel.unselect_all();
                m_wResultsAllCategories.unselect_all();
            }
		}
	}
}

/**
 * Returns 0 if the apply string does not match a key in the selected
 * Categories.
 * Returns 1 otherwise
 */
function inSelectRange(str)
{
	//TODO Here error
    if (m_wResultsAllCategories.get_active() == TRUE) 
        return 1;
    return 1;
}

/**
 * This dictionary gives the index to the m_allItems category structure
 * If the category is selected. Otherwise it returns -1 
 */
function buildApplyDict(allItems)
{
    r1 = allItems[0];
    r2 = allItems[1];
    key1 = r1[0] + ' - ' + r1[1];
    key2 = r2[0] + ' - ' + r2[1];
    myDict = {key1:0, key2: 1};
    if (inSelectRange(key1) == 0)
        myDict[key1] = -1;
    if (inSelectRange(key2) == 0)
        myDict[key2] = -1;
    i = -1;
    for (var row in allItems)
    {
        i = i + 1;
        if (i < 2 )
            continue;
        str = row[0] + ' - ' + row[1];
//        print ' key ',str,' index ',i;
        if (inSelectRange(str) == 1)
            myDict[str] = i;
        else
            myDict[str] = -1;
    }
    return myDict;
}

function buildResultsRange()
{
    getResultHigh();
    getResultLow();
    ApplyDic = buildApplyDict(m_allItems);
    myResults = [['bogus-1','',0.0,0.0,'',0.0],['bogus-2','',0.0,0.0,'',0.0]];
    iResults = 2;
    myIndexToResults = {'bogus-1':0,'bogus-2':1};

// Make sure all categories are examined if we ask for all categoies
    if (m_wResultsAllCategories.get_active() == TRUE)
    {
        let [dyear, dmonth, dday] = m_wResultsDateLow.get_date();
        syear = "%d" % dyear;
        for (var item in m_allItems)
        {
            str = item[0] + ' - ' + item[1];
            if (ApplyDic.has_key(str))
            {
                myIndexToResults[str] = iResults;
                idxToItems = ApplyDic[str];
                sFullYear = m_allItems[idxToItems][2];
                sDD = trimString(m_allItems[idxToItems][5]);
                strDD = _('Yes');
                if (sDD == 'C' )
                    strDD = _('No');
                fBudget = dollarToFloat(sFullYear);
//                print ' Budget of ',str,' is ',fBudget;
                iPayments = string.atoi(m_allItems[idxToItems][3]);
                if (iPayments == 1)
                {
                    sDate = m_allItems[idxToItems][4];
                    sDate = sDate+'/';
                    sDate = sDate+syear;
                    bracketDate = daysFromDate(sDate);
                    if ((bracketDate > m_iResultDateHigh) || (bracketDate  <m_iResultDateLow))
                        fBudget = fBudget* (m_iResultDateHigh - m_iResultDateLow)/365.0;
            	}
                else
                    fBudget = fBudget* (m_iResultDateHigh - m_iResultDateLow)/365.0;
//                print ' After spread budget is ',fBudget
                myResults.append([str,strDD,0.0,fBudget,sFullYear,0.0]);
                iResults = iResults + 1;
            }
            else
            {
            	//print '!!!!!! no index for key ',str;
                continue;
            }
        }
        iResults = 2;
    }

// OK Entire budget is recorded if needed

    for (var curRec in m_allRecords)
    {
        str = curRec[0] + ' - ' + curRec[1];
        if (inSelectRange(str) == 0)
        {
//            print "Record ",curRec," Discarded \n"
            continue;
        }
        day = daysFromDate(curRec[2]);
        if ((m_iResultDateLow > day) || (day > m_iResultDateHigh))
        {
//            print '!!! key ',str,' has date outof range ',day
            continue
        }
        if (myIndexToResults.has_key(str))
            i = myIndexToResults[str];
        else if (ApplyDic.has_key(str))
        {
            myIndexToResults[str] = iResults;
            idxToItems = ApplyDic[str];
            sFullYear = m_allItems[idxToItems][2];
            sDD = trimString(m_allItems[idxToItems][5]);
            strDD = _('Yes');
            if (sDD == 'C')
                strDD = _('No');
            fBudget = dollarToFloat(sFullYear);
//            print ' Budget of ',str,' is ',fBudget;
            iPayments = string.atoi(m_allItems[idxToItems][3]);
            if (iPayments == 1)
            {
                sDate = m_allItems[idxToItems][4];
                day,mon,year = string.split(curRec[2],'/');
                sDate = sDate+'/';
                sDate = sDate+year;
                bracketDate = daysFromDate(sDate);
                if ((bracketDate > m_iResultDateHigh) || (bracketDate  <m_iResultDateLow))
                    fBudget = fBudget* (m_iResultDateHigh - m_iResultDateLow)/365.0;
            }
            else
                fBudget = fBudget* (m_iResultDateHigh - m_iResultDateLow)/365.0;
//            print ' After spread budget is ',fBudget
            myResults.append([str,strDD,0.0,fBudget,sFullYear,0.0]);
            i = iResults;
            iResults = iResults + 1;
        }
        else
        {
//            print '!!!!!! no index for key ',str
            continue;
        }
        myResults[i][2] = myResults[i][2] + dollarToFloat(curRec[3]);
    }
// Done building the data structure!
// Now calculate the difference between budget && expended.

    i = 0;
    m_fDDBudget = 0.0;
    
    for (var myRes in myResults)
    {
        myResults[i][5] = myRes[3] - myRes[2];
        i = i +1;
    }
    return myResults;
}
                
/**
 * decides whether to render the cell red or blue depending on whether category
 * is under or over budget 
 */ 
function renderRedOrBlue(column, cell, model, iter, user_data)
{
    value = model.get_value(iter,5);
    fvalue = dollarToFloat(value);
    if (fvalue < 0)
        cell.set_property("background","LightSalmon1");
    else
        cell.set_property("background","LightBlue1");
}
/**
 * Fill a TreeView with the results of a scan through the data of a selected
 * Range of categories. 
 */
function buildResultsTree()
{
    m_fAllExpenses = 0.0;
    m_fDDExpenses = 0.0;
    m_fAllBudget = 0.0;
    if (m_iFirstRun == 1)
    {
        store = gtk.TreeStore(gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING);
        resTree = gtk.TreeView(store);
        resTree.set_rules_hint(TRUE);
        sel = resTree.get_selection();
        sel.set_mode (gtk.SELECTION_MULTIPLE);
        column = gtk.TreeViewColumn(m_sResultsHeadings[0], gtk.CellRendererText(),
                                    text=0);
        resTree.append_column(column);
        column = gtk.TreeViewColumn(m_sResultsHeadings[1], gtk.CellRendererText(),
                                    text=1);
        resTree.append_column(column);
        column = gtk.TreeViewColumn(m_sResultsHeadings[2], gtk.CellRendererText(),
                                    text=2);
        resTree.append_column(column);
        column = gtk.TreeViewColumn(m_sResultsHeadings[3], gtk.CellRendererText(),
                                    text=3);
        resTree.append_column(column);
        column = gtk.TreeViewColumn(m_sResultsHeadings[4], gtk.CellRendererText(),
                                    text=4);
        resTree.append_column(column);
        column = gtk.TreeViewColumn(m_sResultsHeadings[5], gtk.CellRendererText(),
                                    text=5);
        resTree.append_column(column);
        m_wResultsWindow.add(resTree);
        m_wResultsWindow.show_all();
        m_iFirstRun = 0;
        return resTree;
    }
    myResults = buildResultsRange();

// Now build a treeView to display these as:
// Key, expended, budget, year's budget difference

    store = gtk.TreeStore(gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING);
    resTree = gtk.TreeView(store);
    resTree.set_rules_hint(TRUE);
    sel = resTree.get_selection();
    sel.set_mode (gtk.SELECTION_MULTIPLE);
    column = gtk.TreeViewColumn(_('Category  '), gtk.CellRendererText(),
                                 text=0);
    resTree.append_column(column);
    column = gtk.TreeViewColumn(_('Total Expended  '), gtk.CellRendererText(),
                                 text=1);
    resTree.append_column(column);
    column = gtk.TreeViewColumn(_('Budget for Period '), gtk.CellRendererText(),
                                 text=2);
    resTree.append_column(column);
    column = gtk.TreeViewColumn(_('Budget for Year '), gtk.CellRendererText(),
                                 text=3);
    resTree.append_column(column);
    column = gtk.TreeViewColumn(_('Direct Debit  '), gtk.CellRendererText(),
                                 text=4);
    resTree.append_column(column);
    cell = gtk.CellRendererText();
    column = gtk.TreeViewColumn(_('Difference '), cell,
                                 text=5);
    column.set_cell_data_func(cell,renderRedOrBlue,None);
    resTree.append_column(column);
    m_wResultsWindow.add(resTree);
    m_wResultsWindow.show_all();
    TreeStore = resTree.get_model();
//    print"About to fill results data structure"
    m_fDDExpenses = 0.0;
    m_fDDBudget = 0.0;
    m_fAllExpenses = 0.0;
    m_fAllBudget = 0.0;
    for (var item in myResults)
    {
        str0 = item[0];
        if ((str0 =='bogus-1') || (str0=='bogus-2'))
            continue;
        str1 = floatToStr(item[2]);
        str2 = floatToStr(item[3]);
        ft = dollarToFloat(item[4]);
        str3 = floatToStr(ft);
        str4 = item[1];
        str5 = floatToStr(item[5]);
//        print "Got ",str1,str2,str3,str4,str5;
        TreeStore.append(None,(str0,str1,str2,str3,str4,str5));
        m_fAllExpenses = m_fAllExpenses + item[2];
        m_fAllBudget = m_fAllBudget + item[3];
        if (str4 == "Yes")
        {
            m_fDDExpenses = m_fDDExpenses + item[2];
            m_fDDBudget = m_fDDBudget + item[3];
        }
    }
    m_wAmountBudgeted.set_text(floatToStr(m_fAllBudget));
    m_wTotalSpent.set_text(floatToStr(m_fAllExpenses));
    m_wDDExpended.set_text(floatToStr(m_fDDExpenses));
    m_wDDBudgeted.set_text(floatToStr(m_fDDBudget));
    return resTree;
}
function on_ApplyResultsRange_cb(me)
{
    m_wResultsTree.destroy();
    m_wResultsTree = buildResultsTree();
    return;
}
    
function recordTreeSelection_cb(me)
{
    let [treePath,Col] = m_wRecordTree.get_cursor();
    if (treePath == None)
        return;
    treeModel = m_wRecordTree.get_model();
//    print 'tree path is ',treePath
//    print 'tree path 0 is ',treePath[0];
    m_iEditCurrent = treePath[0];
    m_EditIter = treeModel.get_iter(treePath);
    valCatMajor = treeModel.get_value(m_EditIter,0);
    valCatMinor = treeModel.get_value(m_EditIter,1);
    valDateText = treeModel.get_value(m_EditIter,2);
    valAmountText = treeModel.get_value(m_EditIter,3);
    valComment = treeModel.get_value(m_EditIter,4);
//    print valCatMajor,valCatMinor,valDateText,valAmountText,valComment;
    m_wCatMajEntry.set_text(valCatMajor);
    m_wCatMinEntry.set_text(valCatMinor);
    m_wDateEntry.set_text(valDateText);
    m_wAmountEntry.set_text(valAmountText);
    myBuffer = gtk.TextBuffer();
    myBuffer.set_text(valComment);
    m_wCommentsText.set_buffer(myBuffer);
    m_wCommentsText.show_all();
}
/**
 * Rebuild the Record Tree from the m_allRecords data structure
 */
function rebuildRecordTree()
{
    store = gtk.TreeStore(gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING);
    recwin = m_pXML.get_widget('wRecordWindow');
    recTree = gtk.TreeView(store);
    recTree.set_rules_hint(TRUE);
    sel = recTree.get_selection();
    sel.set_mode (gtk.SELECTION_MULTIPLE);
    column = gtk.TreeViewColumn(m_sRecordHeadings[0], gtk.CellRendererText(),
                                 text=0);
    recTree.append_column(column);
    column = gtk.TreeViewColumn(m_sRecordHeadings[1], gtk.CellRendererText(),
                                 text=1);
    recTree.append_column(column);
    column = gtk.TreeViewColumn(m_sRecordHeadings[2], gtk.CellRendererText(),
                                 text=2);
    recTree.append_column(column);
    column = gtk.TreeViewColumn(m_sRecordHeadings[3], gtk.CellRendererText(),
                                 text=3);
    recTree.append_column(column);
    column = gtk.TreeViewColumn(m_sRecordHeadings[4], gtk.CellRendererText(),
                                 text=4);
    recTree.append_column(column);
    recwin.add(recTree);
    recwin.show_all();
    TreeStore = recTree.get_model();
    for(var frags in m_allRecords)
    {
        f = dollarToFloat(frags[3]);
        s = floatToStr(f);
        TreeStore.append(None,(frags[0],frags[1],frags[2],s,frags[4]));
    }
    m_wRecordTree = recTree;
    sel = m_wRecordTree.get_selection();
    sel.set_mode (gtk.SELECTION_BROWSE);
    sel.connect('changed',recordTreeSelection_cb);
}

function sortOnCategories(a,b)
{
    i = cmp(a[0],b[0]);
    if (i != 0)
        return i;
    i = cmp(a[1],b[1]);
    if (i != 0)
        return i;
    adate = daysFromDate(a[2]);
    bdate = daysFromDate(b[2]);
    i = adate - bdate;
    return i;
}

function sortOnDates(a,b)
{
    adate = daysFromDate(a[2]);
    bdate = daysFromDate(b[2]);
    i = adate - bdate;
    if (i != 0)
        return i;
    i = cmp(a,b);
    return i;
}

function on_MainSortDates_cb(me)
{
    m_wRecordTree.destroy();
    m_allRecords.sort(sortOnDates);
    m_iDirty = 1;
    rebuildRecordTree();
}

function on_MainSort_cb(me)
{
    m_wRecordTree.destroy();
    m_allRecords.sort(sortOnCategories);
    m_iDirty = 1;
    rebuildRecordTree();
}

function buildBudgetTree()
{
    m_fBudgetTotalYear = 0.0;
    m_fBudgetTotalDD = 0.0;
    store = gtk.TreeStore(gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING);
    budgetTree = gtk.TreeView(store);
    budgetTree.set_rules_hint(TRUE);
    sel = budgetTree.get_selection();
    sel.set_mode (gtk.SELECTION_BROWSE);
    column = gtk.TreeViewColumn(m_sBudgetHeadings[0], gtk.CellRendererText(),
                                 text=0);
    budgetTree.append_column(column);
    column = gtk.TreeViewColumn(m_sBudgetHeadings[1], gtk.CellRendererText(),
                                 text=1);
    budgetTree.append_column(column);
    column = gtk.TreeViewColumn(m_sBudgetHeadings[2], gtk.CellRendererText(),
                                 text=2);
    budgetTree.append_column(column);
    column = gtk.TreeViewColumn(m_sBudgetHeadings[3], gtk.CellRendererText(),
                                 text=3);
    budgetTree.append_column(column);

    column = gtk.TreeViewColumn(m_sBudgetHeadings[4], gtk.CellRendererText(),
                                 text=4);
    budgetTree.append_column(column);

    column = gtk.TreeViewColumn(m_sBudgetHeadings[5], gtk.CellRendererText(),
                                 text=5);
    budgetTree.append_column(column);

// Insert model here

    for (var item in m_allItems)
    {
       iter = store.append(None);
       ft = dollarToFloat(item[2]);
       s= floatToStr(ft);
       store.set(iter,0,item[0],
                1,item[1],
                2,s,
                3,item[3],
                4,item[4],
                5,item[5]);
       m_fBudgetTotalYear = m_fBudgetTotalYear + dollarToFloat(item[2]);
       if ((item[5] != 'C') && (item[5] != 'c'))
           m_fBudgetTotalDD = m_fBudgetTotalDD + dollarToFloat(item[2]);
    }
    str = floatToStr(m_fBudgetTotalYear);
    str = addDollar(str);
    m_wBudYearTotalEntry.set_text(str);
    m_fBudgetTotalDD = m_fBudgetTotalDD/26.0;
    str = floatToStr(m_fBudgetTotalDD);
    str = addDollar(str);
    m_wBudDDTotalEntry.set_text(str);
    m_wBudgetWindow.add(budgetTree);
    m_wBudgetWindow.show_all();
    return budgetTree;
}
    
function getBudDay(me)
{
    year, month, day = me.get_date();
    m_sBudDay = "%d/%d/%d" % (day,month+1,year);
    return;
}  

function BudDaySelected_cb(me)
{
    year, month, day = me.get_date();
    m_sBudDay = "%d/%d/%d" % (day,month+1,year);
    return;
}

function getPrevPayments(catMaj,catMin,sTargetDate)
{
    fTotal = 0.0;
    iTargetDays = daysFromDate(sTargetDate);
    for (var rec in m_allRecords) 
    {
        if ((rec[0] == catMaj) && (rec[1] == catMin))
        {
            iDays = daysFromDate(rec[2]);
            if (iTargetDays > iDays)
                fTotal = fTotal + dollarToFloat(rec[3]);
        }
    }
    return fTotal;
}
        
function calculateDDTo(sTargetDate)
{
    iTargetDays = daysFromDate(sTargetDate);
    fTotalDD = 0.0;
    targDay,targMon,targYear = string.split(sTargetDate,'/');
    for (var item in m_allItems)
    {
        if ((item[5] == 'C') || (item[5] == 'c'))
            continue;
 
// Item is direct debit
 
        fTotal = dollarToFloat(item[2]);
        inum = string.atoi(item[3]);
        sDateFirst = item[4];
        iSlash = string.count(sDateFirst,'/');
        if (iSlash < 2)
        {
            sDateFirst = sDateFirst + '/';
            sDateFirst = sDateFirst + targYear;
        }
        if (inum == 0)
        {           
// Handle case of no fixed dates for payments

             myDay,myMon,myYear = string.split(sTargetDate,'/');
             iFirstDay = daysFromDate('1/1/'+myYear);
             fPrevPayments = getPrevPayments(item[0],item[1],sTargetDate);
//             print "for ",item[0],item[1]," already paid ",fPrevPayments;
//             print "first day ",iFirstDay," Target day ",iTargetDays;
             if (fTotal > fPrevPayments)
            {
                 fTotal = fTotal * (iTargetDays - iFirstDay)/365.0;
                 fTotal = fTotal - fPrevPayments;
                 fTotalDD = fTotalDD + fTotal;
            }
        }
        else if (inum == 1)
        {

// Handle case of single yearly payment

//             print 'minor cat ',item[1],'Date of Payment ',sDateFirst
             iItemDay = daysFromDate(sDateFirst);
             iNumDays = 0;
             if (iItemDay > iTargetDays )
                 iNumDays = 365 - (iItemDay - iTargetDays );
             else
                 iNumDays = iTargetDays - iItemDay;
             fTotal = fTotal*iNumDays/365.0;
             fTotalDD = fTotalDD + fTotal;
        }
        else
        {
// Handle case regular fixed payments

             numDaysBetween = 0;
             numDaysBetween = 365.0/inum;
             FirstDay = daysFromDate(sDateFirst);
             iNumDays = 0;
            if (FirstDay > iTargetDays)
            {
                 diff = 365 - (FirstDay - iTargetDays );
                 iNumDays = diff % numDaysBetween;
            }
             else
             {
                 diff = iTargetDays - FirstDay;
                 iNumDays = diff % numDaysBetween;
             }
//             print "FirstDay ",FirstDay," iTargetDays ",iTargetDays," iNumDays ",iNumDays," days between ",numDaysBetween;
             fTotal = fTotal*iNumDays/(inum*numDaysBetween);
//            print "Number payments ",inum," Contribution ",fTotal;
             fTotalDD = fTotalDD + fTotal;
        }
    }
    sTotal = floatToStr(fTotalDD);
    sTotal = addDollar(sTotal);
    return sTotal;
}

m_sDDTotal = '';

/**
 * Generate the data structure needed for the Direct Debit Pane 
 */
function calculateDDResults(sTargetDate)
{   
// Catergory,Total Expended,Budget to Date, Next due date, Budget For Year,Amount needed to be Save
    var myResults = [['bogus-1',0.0,0.0,' bogus-date',0.0,0.0],['bogus-2',0.0,0.0,' bogus-date ',0.0,0.0]];
    iTargetDays = daysFromDate(sTargetDate);
    fTotalDD = 0.0;
    targDay,targMon,targYear = string.split(sTargetDate,'/');
    for(var item in m_allItems)
    {
        if ((item[5] == 'C') || (item[5] == 'c'))
            continue;
 
 // Item is direct debit
 
        fYearTotal = dollarToFloat(item[2])
        fTotal = fYearTotal
        inum = string.atoi(item[3])
        sDateFirst = item[4]
        iSlash = string.count(sDateFirst,'/')
        if (iSlash < 2 )
        {
            sDateFirst = sDateFirst + '/';
            sDateFirst = sDateFirst + targYear;
        }
        fPrevPayments = getPrevPayments(item[0],item[1],sTargetDate);
        iDaysStartYear = daysFromDate('1/1/'+targYear);
        iDaysFirst = daysFromDate(sDateFirst);
        iDaysTarget = daysFromDate(sTargetDate);
        fBudgetToDate = fYearTotal*(iDaysTarget-iDaysStartYear)/365.25;
        sCatName = item[0] + ' - ' + item[1];
        if (inum == 0)
        {
           
// Handle case of no fixed dates for payments

             myDay,myMon,myYear = string.split(sTargetDate,'/');
             iFirstDay = daysFromDate('1/1/'+myYear);
             sDateNext = sTargetDate;
//             print "for ",item[0],item[1]," already paid ",fPrevPayments
//             print "first day ",iFirstDay," Target day ",iTargetDays
             if (fTotal > fPrevPayments)
             {
                 fTotal = fTotal * (iTargetDays - iFirstDay)/365.0;
                 fTotal = fTotal - fPrevPayments;
                 fTotalDD = fTotalDD + fTotal;
             }
		}
        else if (inum == 1)
        {

// Handle case of single yearly payment

//             print 'minor cat ',item[1],'Date of Payment ',',sDateFirst
             iItemDay = daysFromDate(sDateFirst);
             if (iItemDay > iDaysTarget)
                 sDateNext = sDateFirst;
             else 
             {
                 firstDay, firstMon, firstYear = string.split(sDateFirst,'/');
                 iYear = string.atoi(firstYear);
                 if (iYear <100)
                     iYear += 2000;
                 iYear += 1;
                 sYear = '%d' % iYear;
                 sDateNext = firstDay+'/'+firstMon+'/'+sYear;
             }
             iNumDays = 0;
             if (iItemDay > iTargetDays)
                 iNumDays = 365 - (iItemDay - iTargetDays );
             else
                 iNumDays = iTargetDays - iItemDay;
             fTotal = fTotal*iNumDays/365.0;
             fTotalDD = fTotalDD + fTotal;
        }
        else
        {

// Handle case regular fixed payments

             numDaysBetween = 0;
             numDaysBetween = 365.0/inum;
             FirstDay = daysFromDate(sDateFirst);
             iNumDays = 0;
             if (FirstDay > iTargetDays)
             {
                 diff = 365 - (FirstDay - iTargetDays );
                 iNumDays = diff % numDaysBetween;
                 sDateNext = dateFromDays(FirstDay);
             }
             else
            {
                 diff = iTargetDays - FirstDay;
                 iNumDays = diff % numDaysBetween;
                 iNext = int(diff/numDaysBetween) + 1;
                 sDateNext = dateFromDays(FirstDay + iNext*numDaysBetween);
            }
//             print "FirstDay ",FirstDay," iTargetDays ",iTargetDays," iNumDays ",iNumDays," days between ",numDaysBetween;
             fTotal = fTotal*iNumDays/(inum*numDaysBetween);
//             print "Number payments ",inum," Contribution ",fTotal;
             fTotalDD = fTotalDD + fTotal;
        }
        myResults.append([sCatName,fPrevPayments,fBudgetToDate,sDateNext,fYearTotal,fTotal]);
    }
    m_sDDTotal = floatToStr(fTotalDD);
    m_sDDTotal = addDollar(m_sDDTotal);
    return myResults;
}

/**
 * Now build a tree showing all the results for the Direct Debit Account
 *
 * Fill a TreeView with the results of a scan through the data of all the
 * the direct debit items up to the requested Date
 */
function buildDDResultsTree()
{
    let [year, month, day] = m_wDDCalendar.get_date();
    m_sDDDate = "%d/%d/%d" % (day,month+1,year);
    m_wDDDateChosenEntry.set_text(m_sDDDate);
    myResults = calculateDDResults(m_sDDDate);

// Now build a treeView to display these as:
// Key, expended, budget, year's budget difference

    store = gtk.TreeStore(gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING,
                          gobject.TYPE_STRING);
    resTree = gtk.TreeView(store);
    resTree.set_rules_hint(TRUE);
    sel = resTree.get_selection();
    sel.set_mode (gtk.SELECTION_MULTIPLE);
    column = gtk.TreeViewColumn(m_sDDHeadings[0], gtk.CellRendererText(),
                                 text=0);
    resTree.append_column(column);
    column = gtk.TreeViewColumn(m_sDDHeadings[1], gtk.CellRendererText(),
                                 text=1);
    resTree.append_column(column);
    column = gtk.TreeViewColumn(m_sDDHeadings[2], gtk.CellRendererText(),
                                 text=2);
    resTree.append_column(column);
    column = gtk.TreeViewColumn(m_sDDHeadings[3], gtk.CellRendererText(),
                                 text=3);
    resTree.append_column(column);
    column = gtk.TreeViewColumn(m_sDDHeadings[4], gtk.CellRendererText(),
                                 text=4);
    resTree.append_column(column);
    column = gtk.TreeViewColumn(m_sDDHeadings[5], gtk.CellRendererText(),
                                 text=5);
    resTree.append_column(column);
    m_wResultsWindow.add(resTree);
    m_wResultsWindow.show_all();
    TreeStore = resTree.get_model();

    m_fDDSaved = 0.0;

    for (var item in myResults)
    {
        str0 = item[0];
        if ((str0 =='bogus-1') || (str0=='bogus-2'))
            continue;
        str1 = floatToStr(item[1]);
        str2 = floatToStr(item[2]);
        str3 = item[3];
        str4 = floatToStr(item[4]);
        str5 = floatToStr(item[5]);
        TreeStore.append(None,(str0,str1,str2,str3,str4,str5));
        m_fDDSavings += item[4];
    }   
    sLead = _("From your budget && the amount you've already spent, you will need to have saved");
    sFollow = _('by the date');
    sSavingsText = '<span size="xx-large">'+sLead+' <b>'+m_sDDTotal+'</b>'+sFollow+'<b>'+m_sDDDate+'</b></span>';
    m_lbDDResults.set_label(sSavingsText);
    return resTree;
}
    
function rebuildDDTree()
{
    m_wDDResultsTree.destroy();
    m_wDDResultsTree = buildDDResultsTree();
    m_wDDWindow.add(m_wDDResultsTree);
    m_wDDWindow.show_all();
    return;
}

function onDDDateChanged_cb(me){
    rebuildDDTree();
    return;
}
    
function on_ChooseDDTarget_cb(me)
{
    var myDate = gtk.Dialog("Direct Debit savings at date",
                     m_wMainWin,
                     gtk.DIALOG_MODAL | gtk.DIALOG_DESTROY_WITH_PARENT,
                     (gtk.STOCK_OK, gtk.RESPONSE_APPLY,
                      gtk.STOCK_CANCEL, gtk.RESPONSE_REJECT));
    vbox = myDate.vbox;
    date = gtk.Calendar();
    date.connect('day_selected',BudDaySelected_cb);
    vbox.add(date);
    myDate.show_all();
    response = myDate.run();
    getBudDay(date);
    m_wBudDDTargetDateEntry.set_text(m_sBudDay);
    sDDTarget = calculateDDTo(m_sBudDay);
    m_wBudTargetNeededEntry.set_text(sDDTarget);
    myDate.destroy();
    return;
}

function on_ChooseFirstDate_cb(me)
{
    var myDate = gtk.Dialog("First Payment Date",
                     m_wMainWin,
                     gtk.DIALOG_MODAL | gtk.DIALOG_DESTROY_WITH_PARENT,
                     (gtk.STOCK_OK, gtk.RESPONSE_APPLY,
                      gtk.STOCK_CANCEL, gtk.RESPONSE_REJECT));
    vbox = myDate.vbox;
    date = gtk.Calendar();
    date.connect('day_selected',BudDaySelected_cb);
    vbox.add(date);
    myDate.show_all();
    response = myDate.run();
    if (response == gtk.RESPONSE_APPLY)
    {
        day,mon,year = string.split(m_sBudDay,'/');
        imon = string.atoi(mon) +1;
        mon = "%d" % imon;
        sDate = day + '/' + mon;
        m_wBudDDTargetDateEntry.set_text(sDate);
        sDDTarget = calculateDDTo(m_sBudDay);
        m_wBudTargetNeededEntry.set_text(sDDTarget);
    }
    myDate.destroy();
    return;
}

function budgetTreeSelection_cb(me)
{
    treePath,col = m_wBudgetTree.get_cursor();
    model = m_wBudgetTree.get_model();
    iter = model.get_iter(treePath);
    catMaj = model.get_value(iter,0);
    catMin = model.get_value(iter,1);
    sTotal = model.get_value(iter,2);
    sFreq = model.get_value(iter,3);
    sStartDate = model.get_value(iter,4);
    sDD = model.get_value(iter,5);
    m_wBudMajEntry.set_text(catMaj);
    m_wBudSubCatEntry.set_text(catMin);
    m_wBudYearlyEntry.set_text(addDollar(sTotal));
    iSpin = string.atoi(sFreq);
    m_wBudNumSchedSpin.set_value(iSpin);
    m_wBudDateFirstEntry.set_text(sStartDate);
    if ((sDD != 'c') && (sDD != 'C'))
        m_wBudCashOrDDEntry.set_text('D');
    else
        m_wBudCashOrDDEntry.set_text('C');
    m_LastBudgetRecord[0] = catMaj;
    m_LastBudgetRecord[1] = catMin;
    m_LastBudgetRecord[2] = sTotal;
    m_LastBudgetRecord[3] = sFreq;
    m_LastBudgetRecord[4] = sStartDate;
    m_LastBudgetRecord[5] = sDD;
    m_iBudEditCurrent = treePath[0];
    return;
}

function on_BudgetReplace_cb(me){
    catMaj = m_wBudMajEntry.get_text();
    catMin = m_wBudSubCatEntry.get_text();
    fTotal = dollarToFloat(m_wBudYearlyEntry.get_text());
    sTotal = floatNoDollar(fTotal);
    iSpin = m_wBudNumSchedSpin.get_value();
    sSpin = "%d" % iSpin;
    sDateFirst = m_wBudDateFirstEntry.get_text();
    sCashOrDD = m_wBudCashOrDDEntry.get_text();
    sCashOrDD = string.lower(sCashOrDD);
    sCashOrDD = string.strip(sCashOrDD);
    if ((sCashOrDD[0] == 'y') || (sCashOrDD[0] == 'c'))
        sCashOrDD = 'C';
    else
        sCashorDD = 'D';
    newItem = ['','','','','',''];
    newItem[0] = catMaj;
    newItem[1] = catMin;
    newItem[2] = addDollar(sTotal);
    newItem[3] = sSpin;
    newItem[4] = sDateFirst;
    newItem[5] = sCashOrDD;
    if (m_iBudEditCurrent >= 0)
        m_LastBudgetRecord = m_allItems[m_iBudEditCurrent]; 
    if (m_iBudEditCurrent >= 0)
        m_allItems[m_iBudEditCurrent] = newItem;
    else
        return;
    rebuildTrees();
    updateRecordTree(newItem);
    m_iDirty = 1;
    return;
}
    
function rebuildTrees(){
    m_wCategoryTree.destroy();
    m_wBudgetTree.destroy();
    m_wResultsCategoryTree.destroy();
    m_allItems.sort();
    m_wBudgetTree = buildBudgetTree();
    m_wCategoryTree = rebuildCategoryTree();
    m_wResultsCategoryTree = rebuildResultsCategoryTree();
    rebuildDDTree();
    sel = m_wCategoryTree.get_selection();
    sel.set_mode (gtk.SELECTION_BROWSE);
    sel.connect('changed',catTreeSelection_cb);
    sel2 = m_wResultsCategoryTree.get_selection();
    sel2.set_mode(gtk.SELECTION_MULTIPLE);
    sel2.connect('changed',onResultsCatSelected_cb);
    m_iResultsCatSelected = 0;
    sel3 = m_wBudgetTree.get_selection();
    sel3.set_mode (gtk.SELECTION_BROWSE);
    sel3.connect('changed',budgetTreeSelection_cb);
    return;
}

    
function on_BudgetSort_cb(me)
{
    m_iDirty = 1;
    rebuildTrees();
    return;
}

function on_BudgetAdd_cb(me)
{
    catMaj = m_wBudMajEntry.get_text();
    catMin = m_wBudSubCatEntry.get_text();
    fTotal = dollarToFloat(m_wBudYearlyEntry.get_text());
    sTotal = floatNoDollar(fTotal);
    iSpin = m_wBudNumSchedSpin.get_value();
    sSpin = "%d" % iSpin;
    sDateFirst = m_wBudDateFirstEntry.get_text();
    sCashOrDD = m_wBudCashOrDDEntry.get_text();
    sCashOrDD = string.lower(sCashOrDD);
    sCashOrDD = string.strip(sCashOrDD);
    if ((sCashOrDD[0] == 'y') || (sCashOrDD[0] == 'c'))
        sCashOrDD = 'C';
    else
        sCashorDD = 'D';
    newItem = ['','','','','',''];
    newItem[0] = catMaj;
    newItem[1] = catMin;
    newItem[2] = addDollar(sTotal);
    newItem[3] = sSpin;
    newItem[4] = sDateFirst;
    newItem[5] = sCashOrDD;
    m_LastBudgetRecord = newItem;
    m_allItems.append(newItem);
    rebuildTrees();
    updateRecordTree(newItem);
    m_iDirty = 1;

// Fixme should search for this item

    m_iBudEditCurrent = -1;
    return;
}
    
function on_BudgetDelete_cb(me)
{
    let [treePath,col] = m_wBudgetTree.get_cursor();
    var model = m_wBudgetTree.get_model();

// Should pop-up a nice help window

    if (treePath == None)
        return;
    
    iter = model.get_iter(treePath);
    m_iBudEditCurrent = treePath[0];

// FIXME should handle the records too

    delete m_allItems[m_iBudEditCurrent];
    rebuildTrees();
    m_iDirty = 1;
    m_iBudEditCurrent = -1;
    return;
}

function on_BudgetNew_cb(me){
    m_iBudEditCurrent = -1;
    m_wBudMajEntry.set_text('');
    m_wBudSubCatEntry.set_text('');
    m_wBudYearlyEntry.set_text('');
    iSpin = string.atoi('1');
    m_wBudNumSchedSpin.set_value(iSpin);
    m_wBudDateFirstEntry.set_text('0/0');
    m_wBudCashOrDDEntry.set_text(_('yes'));
    return;
}

function removeAmps(str)
{
    var ilen = len(str);
    var j = 0;
    var ostr = '';
    while (j< ilen)
    {
        if (str[j] == '&')
            ostr = ostr + 'and';
        else
            ostr = ostr + str[j];
        j = j + 1;
    }
    return ostr;
}
/**
 * Export a gtk tree to an AbiWord file
 */
function exportToAbiword(tree,sAbiFile,sHeadings)
{
    fAbiFileName = open(sAbiFile,'w');

    model = tree.get_model();
    iterFirst = model.get_iter_first();
    countRows = 0;
    iter = iterFirst;
    bstop = 1;
    while (bstop==1)
    {
        iter = model.iter_next(iter);
        if (iter != None)
            countRows = countRows + 1;
        else
            bstop = 0;
    }
    numCols = 0;
    bStop = 1;
    curCol = tree.get_column(numCols);
    if (curCol == None)
        bStop =0;
    if (bStop == 1)
    {
        colwidth0 = curCol.get_width();    
        numCols = numCols +1;
        colWidths = [colwidth0];
        while (bStop == 1)
        {
            curCol =  tree.get_column(numCols);
            if (curCol == None)
                bStop =0;
            else
            {
                width = tree.get_column(numCols).get_width();
                if (width > 200)
                    width = 200;
                colWidths.append(width);
                numCols = numCols +1;
            }
        }       
    }
// write out the boiler plate header for a simple AbiWord file

    for (var lin in m_sAbiHead)
        fAbiFileName.write(lin);

// Don't set fix width coz it might flow past the edge of abiword.
// Instead let the user worry about it.
    lin = '<table>';
    fAbiFileName.write(lin);

// OK write out the table

    iter = iterFirst;
    bstop = 1;
    row = 0;
    bDoHeadings = 0;
    if (sHeadings != None)
        bDoHeadings = 1;
    while (bstop ==1)
    {
        for(var i in range(numCols)){
            sval = model.get_value(iter,i);
            sval = trimString(sval);
            sval = removeAmps(sval);
            fval = 0.0;
            isnum = 0;
            iright = i+1;
            ibot = row +1;
            sbot = '%d' % ibot;
            sleft = '%d' % i;
            sright = '%d' % iright;
            sstop = '%d' % row;
            lin = '<cell props="bot-attach:'+sbot+'; left-attach:'+sleft+'; right-attach:'+sright+'; top-attach:'+sstop+'">';

            fAbiFileName.write(lin);
            if ((len(sval)> 0) && (sval[0] == '$'))
            {
                fval = dollarToFloat(sval);
                isnum = 1;
            }    
            else if ((len(sval)>0) && (sval.isdigit()))
            {
                fval = string.atof(sval);
                isnum = 1;
            }
            if (bDoHeadings == 1)
                sval = sHeadings[i];
            if ((isnum == 0) && (len(sval) == 0))
                lin = '<p style="Normal"></p>';
            else
                lin = '<p style="Normal">%s</p>' % sval;
            fAbiFileName.write(lin);
            lin = '</cell>';
            fAbiFileName.write(lin);
        }
        if (bDoHeadings == 1)
            iter = iterFirst;
        else
            iter = model.iter_next(iter);
        bDoHeadings = 0;
        if (iter != None)
            row = row + 1;
        else
            bstop = 0;
    }
    fAbiFileName.write('</table>');
    fAbiFileName.write('<p></p>');
    fAbiFileName.write('</section>');
    fAbiFileName.write('</abiword>');
    fAbiFileName.close();

// OK now start up a AbiWord process with this file

    sAbiExec = findAbiWord();
    if (sAbiExec != None) 
    {
        lin = sAbiExec+' '+sAbiFile+' &';
        os.system(lin);
    }
    else {
        response = gtk.RESPONSE_NO;
        noAbi = gtk.Dialog(_('No AbiWord',
                             m_wMainWin,
                             gtk.DIALOG_MODAL | gtk.DIALOG_DESTROY_WITH_PARENT,
                             (gtk.STOCK_OK, gtk.RESPONSE_NO)));
        vbox = noAbi.vbox;
        label = gtk.Label(_('You do not have the AbiWord Word processor installed on your system. \n You can download this excellent && free Word Processor from http://www.abisource.com'));
        vbox.add(label);
        noAbi.show_all();
        response = noAbi.run();
        noAbi.destroy();
    }
    return;
}

/**
 * Export a gtk tree to a gnumeric file
 */
function exportToGnumeric(tree,sGnuFile,sHeadings)
{
    fGnuFileName = open(sGnuFile,'w');

    model = tree.get_model();
    iterFirst = model.get_iter_first();
    countRows = 0;
    iter = iterFirst;
    bstop = 1;
    while (bstop==1)
    {
        iter = model.iter_next(iter);
        if (iter != None)
            countRows = countRows + 1;
        else
            bstop = 0;
    }
    numCols = 0;
    bStop = 1;
    curCol = tree.get_column(numCols);
    if (curCol == None)
        bStop =0;
    if (bStop == 1)
    {
        colwidth0 = curCol.get_width();    
        numCols = numCols +1;
        colWidths = [colwidth0];
        while (bStop == 1)
        {
            curCol =  tree.get_column(numCols);
            if (curCol == None)
                bStop =0;
            else
            {
                width = tree.get_column(numCols).get_width();
                if (width > 200)
                    width = 200;
                colWidths.append(width);
                numCols = numCols +1;
            }
        }

    }
// write out the boiler plate header for a simple gnumeric file
// with maxcols && maxrows set to correct values

    for (var lin in m_sGnumericHead ) 
    {
        if (lin.find('%MaxCols%') >= 0)
        {
            str = '%d' % (numCols+1);
            lin = lin.replace('%MaxCols%',str);
        }
        if (lin.find('%MaxRows%') >= 0)
        {
            str = '%d' % (countRows+1);
            lin = lin.replace('%MaxRows%',str);
        }
        fGnuFileName.write(lin);
    }

// write out number of cols

    lin = '      <gmr:Cols DefaultSizePts="48">\n';
    fGnuFileName.write(lin);
    if (debugMsgs)
        print ('MSEVIOR: numCols =',numCols);
    for(var i in range(numCols)){
        colwidth = colWidths[i];
        lin ='         <gmr:ColInfo No="%d" Unit="%f" MarginA="2" MarginB="2" HardSize="1"/> \n' % (i,colwidth*0.7);
        fGnuFileName.write(lin);
    }
    lin = '      </gmr:Cols> \n';
    fGnuFileName.write(lin);

// Number of rows

    lin ='       <gmr:Rows DefaultSizePts="12.75"> \n';
    fGnuFileName.write(lin);
    lin = '        <gmr:RowInfo No="0" Unit="12.75" MarginA="0" MarginB="0" Count="%d"/> \n' % countRows;
    fGnuFileName.write(lin);
    lin = '      </gmr:Rows> \n';
    fGnuFileName.write(lin);

    // OK now write out each cell

    lin = '      <gmr:Cells> \n';
    fGnuFileName.write(lin);
    iter = iterFirst;
    bstop = 1;
    row = 0;
    bDoHeadings = 0
    if (sHeadings != None)
        bDoHeadings = 1;
    while (bstop ==1)
    {
        for(var i in range(numCols)){
            sval = model.get_value(iter,i);
            sval = trimString(sval);
            sval = removeAmps(sval);
            fval = 0.0;
            isnum = 0;
            if (bDoHeadings == 1)
            {
                sval = sHeadings[i];
                lin = '        <gmr:Cell Col="%d" Row="%d" ValueType="60">%s</gmr:Cell> \n' % (i,row,sval);
            }
            else {
                if ((len(sval)> 0) && (sval[0] == '$'))
                {
                    fval = dollarToFloat(sval)
                    isnum = 1
                }
                else if ((len(sval)>0) && (sval.isdigit()))
                {
                    fval = string.atof(sval);
                    isnum = 1;
                }
                if ((isnum == 0) && (len(sval) == 0))
                    lin = '        <gmr:Cell Col="%d" Row="%d" ValueType="60"> </gmr:Cell> \n' % (i,row);
                else if ((isnum == 0) && (len(sval) > 0))
                    lin = '        <gmr:Cell Col="%d" Row="%d" ValueType="60">%s</gmr:Cell> \n' % (i,row,sval);
                else
                    lin = '        <gmr:Cell Col="%d" Row="%d" ValueType="40">%f</gmr:Cell> \n' % (i,row,fval);
            }
            fGnuFileName.write(lin);
        }
        if (bDoHeadings == 1)
            iter = iterFirst;
        else
            iter = model.iter_next(iter);
        bDoHeadings = 0;
        if (iter != None)
            row = row + 1;
        else
            bstop = 0;
    }
    lin = '      </gmr:Cells>\n';
    fGnuFileName.write(lin);
    
// write out the boiler plater footer for a simple gnumeric file

    for(var lin in m_sGnumericFoot) {
        fGnuFileName.write(lin);
    }
    fGnuFileName.close();

// OK now start up a gnumeric process with this file

    lin = 'gnumeric '+sGnuFile+' &';
    os.system(lin);
    return;
}
                
function getPathOnly(sFileName){
    ilen = len(sFileName);
    bstop = 1;
    j = ilen -1;
    while ((j>=0) && (bstop == 1))
    {
        if (sFileName[j] == pDelim)
            bstop = 0;
        else
            j = j -1;
    }
    if (j < 0)
        return '';
//    else
//        return sFileName[0:j+1];
    return ''; // ITS STUB. REMOVE IT
}
    
function onGnumericExportRecords(me){
    m_sCurrentFile = m_RecentFiles.getNthRecent(1);
    var spath = getPathOnly(m_sCurrentFile);
    sFile = spath + 'records.gnumeric';
    sFile = chooseExportFile(sFile);
    exportToGnumeric(m_wRecordTree,sFile,m_sRecordHeadings);
    return;
}

function onGnumericExportResults(me){
    m_sCurrentFile = m_RecentFiles.getNthRecent(1);
    var spath = getPathOnly(m_sCurrentFile);
    sFile = spath + 'results.gnumeric';
    sFile = chooseExportFile(sFile);
    exportToGnumeric(m_wResultsTree,sFile,m_sResultsHeadings);
    return;
}

    
function onGnumericExportBudget(me){
    m_sCurrentFile = m_RecentFiles.getNthRecent(1);
    var spath = getPathOnly(m_sCurrentFile);
    sFile = spath + 'budget.gnumeric';
    sFile = chooseExportFile(sFile);
    exportToGnumeric(m_wBudgetTree,sFile,m_sBudgetHeadings);
    return;
}

function onGnumericExportDD(me){
    m_sCurrentFile = m_RecentFiles.getNthRecent(1);
    var spath = getPathOnly(m_sCurrentFile);
    sFile = spath + 'DirectDebit.gnumeric';
    sFile = chooseExportFile(sFile);
    exportToGnumeric(m_wDDResultsTree,sFile,m_sDDHeadings);
    return;
}
    
function onAbiExportRecords(me){
    m_sCurrentFile = m_RecentFiles.getNthRecent(1);
    var spath = getPathOnly(m_sCurrentFile);
    sFile = spath + 'records.abw';
    sFile = chooseExportFile(sFile);
    exportToAbiword(m_wRecordTree,sFile,m_sRecordHeadings);
    return;
}

function onAbiExportResults(me){
    m_sCurrentFile = m_RecentFiles.getNthRecent(1);
    var spath = getPathOnly(m_sCurrentFile);
    sFile = spath + 'results.abw';
    sFile = chooseExportFile(sFile);
    exportToAbiword(m_wResultsTree,sFile,m_sResultsHeadings);
    return;
}
    
function onAbiExportBudget(me){
    m_sCurrentFile = m_RecentFiles.getNthRecent(1);
    var spath = getPathOnly(m_sCurrentFile);
    sFile = spath + 'budget.abw';
    sFile = chooseExportFile(sFile);
    exportToAbiword(m_wBudgetTree,sFile,m_sBudgetHeadings);
    return
}
    
function onAbiExportDD(me){
    m_sCurrentFile = m_RecentFiles.getNthRecent(1);
    var spath = getPathOnly(m_sCurrentFile);
    sFile = spath + 'DirectDebit.abw';
    sFile = chooseExportFile(sFile);
    exportToAbiword(m_wDDResultsTree,sFile,m_sDDHeadings);
    return;
}

    
function onConfigure_cb(me,event){
    let [iWidth, iHeight] = m_wMainWin.get_size();
    var sWidth = "%d" % iWidth;
    var sHeight = "%d" % iHeight;
    if (!isWin)
    {
        m_GConfClient.set_string('/apps/myBudget/width',sWidth);
        m_GConfClient.set_string('/apps/myBudget/height',sHeight);
    }
    return;
}

function onHelp_cb(me){
    var sDocPath = buildPath('docs'+pDelim+'MyBudget.html');
    if (isWin)
        webbrowser.open(sDocPath);
    m_sBrowser = findLinuxBrowser();
    if (m_sBrowser != None)
        os.system(m_sBrowser+' '+sDocPath+' &');
    return;
}
    
function onAbout_cb(me){
    var response = gtk.RESPONSE_OK
    var qAbout = Gtk.Dialog(_('About MyBudget'),
                     m_wMainWin,
                     Gtk.DIALOG_MODAL | Gtk.DIALOG_DESTROY_WITH_PARENT,
                     (Gtk.STOCK_OK, Gtk.RESPONSE_OK))
    var vbox = qAbout.vbox;
    var label = gtk.Label(_('MyBudget is a personal finance program. \n (C) Martin Sevior <msevior@physics.unimelb.edu.au> \n This program is Free Software licensed under the Lesser General Public License (LGPL) \n'));
    vbox.add(label);
    qAbout.show_all();
    response = qAbout.run();
    qAbout.destroy();
    return;
}

function onExportAbi_cb(me){
    var iPage = m_wNoteBook.get_current_page();
    if (iPage == defEnterOrEdit)
        onAbiExportRecords(me);
    else if (iPage == defTotals)
        onAbiExportResults(me);
    else if (iPage == defBudget)
        onAbiExportBudget(me);
    else if (iPage == defDirectDebit)
        onAbiExportDD(me);
    return;
}

function onExportGnumeric_cb(me){
    var iPage = m_wNoteBook.get_current_page()
    if (iPage == defEnterOrEdit)
    	onGnumericExportRecords(me);
    else if (iPage == defTotals)
        onGnumericExportResults(me);
    else if (iPage == defBudget)
        onGnumericExportBudget(me);
    else if (iPage == defDirectDebit)
        onGnumericExportDD(me);
    return;
}

    
function on_Example_cb(me){
	var sExample = buildPath('example.myb');
    if (m_iDirty > 0 )
    {
        var res = querySave();
        if (res == gtk.RESPONSE_REJECT)
            return;
    }
    doOpenFile(sExample);
    return;
}
    
function connectSignals()
{
//	global m_wCategoryTree,m_wBudgetTree,m_wRecordTree,m_wResultsCat
//    global m_iResultsCatSelected
//    
//    sel = m_wCategoryTree.get_selection()
//    sel.set_mode (gtk.SELECTION_BROWSE)
//    sel.connect('changed',catTreeSelection_cb)
//    sel2 = m_wResultsCategoryTree.get_selection()
//    sel2.set_mode(gtk.SELECTION_MULTIPLE)
//    sel2.connect('changed',onResultsCatSelected_cb)
//    m_iResultsCatSelected = 0
//    sel3 = m_wBudgetTree.get_selection()
//    sel3.set_mode (gtk.SELECTION_BROWSE)
//    sel3.connect('changed',budgetTreeSelection_cb)
//    sel4 = m_wRecordTree.get_selection()
//    sel4.set_mode (gtk.SELECTION_BROWSE)
//    sel4.connect('changed',recordTreeSelection_cb)
   
//    wMenuQuit.connect('activate',saveAndQuit_cb)
//    m_wDateSelector.connect('day_selected',daySelected_cb)
//    m_wMainWin.connect('destroy', lambda win: SaveAndQuit())
//    m_wMainWin.connect('configure-event',onConfigure_cb)
//    m_wAddButton.connect('clicked',on_AddButton_cb)
//    m_wTBSaveButton.connect('clicked',on_Save_cb)
//    m_wMenuSave.connect('activate',on_Save_cb)
//    m_wMenuSaveAs.connect('activate',on_SaveAs_cb)
//    m_wTBNew.connect('clicked',on_New_cb)
//    m_wMenuNew.connect('activate',on_New_cb)
//    m_wTBOpen.connect('clicked',on_Open_cb)
//    m_wMenuOpen.connect('activate',on_Open_cb)
//    m_wMenuExample.connect('activate',on_Example_cb)
//    m_wMainReplace.connect('clicked',on_MainReplace_cb)
//    m_wMainDelete.connect('clicked',on_MainDelete_cb)
//    m_wResultsDateLow.connect('day_selected',on_ResultLow_cb)
//    m_wResultsDateHigh.connect('day_selected',on_ResultHigh_cb)
//    m_wResultsApply.connect('clicked',on_ApplyResultsRange_cb)
//    m_wResultsAllCategories.connect('clicked',onResultsAllCats_cb)
//    m_wMainSort.connect('clicked',on_MainSort_cb)
//    m_wSortDates.connect('clicked',on_MainSortDates_cb)
//    m_wBudChooseDDTargetButton.connect('clicked',on_ChooseDDTarget_cb)
//    m_wBudChooseFirstDateButton.connect('clicked',on_ChooseFirstDate_cb)
//    m_wBudReplace.connect('clicked',on_BudgetReplace_cb)
//    m_wBudSort.connect('clicked',on_BudgetSort_cb)
//    m_wBudAdd.connect('clicked',on_BudgetAdd_cb)
//    m_wBudDelete.connect('clicked',on_BudgetDelete_cb)
//    m_wBudNew.connect('clicked',on_BudgetNew_cb)
//    m_wMenuAbout.connect('activate',onAbout_cb)
//    m_wMenuHelp.connect('activate',onHelp_cb)
//    m_wTBExportAbi.connect('clicked',onExportAbi_cb)
//    m_wTBExportGnumeric.connect('clicked',onExportGnumeric_cb)
//    m_wMenuExportAbi.connect('activate',onExportAbi_cb)
//    m_wMenuExportGnumeric.connect('activate',onExportGnumeric_cb)
//    m_wDDCalendar.connect('day-selected',onDDDateChanged_cb)
	
}
connectSignals();
win.show_all(); // As in previous we need to show all

// And run
Gtk.main();

////////////////////////////////////////////////
//
//# Debug Messages Value
//# Set to TRUE to turn on debug printing
//# Set to FALSE to hide all but critical messages for end users
//debugMsgs=TRUE
//
//
//
//isWin=osDetect()
//pDelim = ''
//if isWin:
//    global pDelim
//    pDelim="\\"
//else:
//    pDelim='/'
//
//
//            
//sPREFIX=findPrefix()
//if debugMsgs:
//    print('RP: sPREFIX:'+sPREFIX)
//    print('RP: pDelim:'+pDelim)
//    
//sPath = os.getenv('PATH')
//sPaths = string.split(sPath,':')
//
//#
//# Member variables && structures.
//#
//# m_iCurrentCatIndex // Points to the current selected item in caterogies
//# m_pXML // The glade class that holds the interface
//# m_wCatEntry  // The catergory entry 
//# m_wDateEntry  // The Date entry widget
//# m_wAmountEntry  // The amount entry widget
//# m_wCommentsText // The Comments TextView
//# m_wDateSelector // The Date selector widget
//# m_wAddButton  // The "add" buttom
//# m_allItems // The list Of catergories (maj,min,Budget,Num/year,First due)
//
//
//
//#
//# Fire up the splashscreen
//#
//splashDelay =3000
//wSplash = gtk.Window(gtk.WINDOW_POPUP )
//wSplash.set_decorated(FALSE)
//wSplashScreen = gtk.Image()
//sSplash = buildPath('splashscreen.png')
//if debugMsgs:
//    print 'MSEVIOR: splashscreen path ',sSplash
//    print 'MSEVIOR: exists.. ',os.path.exists(sSplash)
//wSplashScreen.set_from_file(sSplash)
//wSplashScreen.show()
//# Make a pretty frame
//
//wSplashFrame = gtk.Frame()
//wSplashFrame.set_shadow_type(gtk.SHADOW_OUT)
//wSplashFrame.add(wSplashScreen)
//wSplashFrame.show()
//wSplash.add(wSplashFrame)
//
//#
//# OK throw up the splashscreen
//#
//wSplash.set_position(gtk.WIN_POS_CENTER_ALWAYS)
//wSplash.show()
//gtk.main_iteration(TRUE)
//for i in range(5):
//    gtk.main_iteration()
//
//gobject.timeout_add(splashDelay,destroySplash,wSplash)
//
//inGnuHead = open(buildPath('gnumeric_head.txt'),'r')
//inGnuFoot = open(buildPath('gnumeric_foot.txt'),'r')
//
//m_sGnumericHead = inGnuHead.readlines()
//m_sGnumericFoot = inGnuFoot.readlines()
//inGnuHead.close()
//inGnuFoot.close()
//
//inAbiHead = open(buildPath('abiword_head.txt'),'r')
//m_sAbiHead = inAbiHead.readlines()
//inAbiHead.close()
//
//#print "Gumeric Header is ",m_sGnumericHead
//#print "Gumeric Foot is ",m_sGnumericFoot
//
//fname = buildPath(pDelim+'glade'+pDelim+'mybudget.glade')
//    
//
// 
//# create widget tree ...
//
//m_pXML = gtk.glade.XML(fname)
//
//gettext.textdomain('myBudget')
//gettext.bindtextdomain('myBudget', buildPath('po'+pDelim))
//_ = gettext.gettext
//
//#
//# Load GConf now if we're not on Windows
//#
//if isWin:
//    import _winreg
//else:
//    import gconf
//    m_GConfClient = gconf.client_get_default ()
//
//
//sInitialFile = None
//if len(sys.argv) > 1:
//    sInitialFile = sys.argv[1]
//    if os.path.exists(sInitialFile):
//        sInitialFile = None
//
//
//#
//# Read in the Categories && make the result globally available
//#
//m_allItems = [['','','','','',''],['','','','','','']]
//m_allRecords = [['','','','',''],['','','','','']]
//m_iNumRecords = 0
//m_LastBudgetRecord =['','','','','','']
//#
//# Set up the global variables
//#
//m_iEditCurrent = -1
//m_iBudEditCurrent = -1
//m_iCurrentCatIndex = 0
//m_sCurrentFile = ''
//m_iDirty = 0
//m_iResultsCatSelected = 0
//
//
//m_wCatMajEntry.set_property('editable',FALSE)
//m_wCatMinEntry.set_property('editable',FALSE)
//m_iResultsAllCatsChosen = 0;
//
//defEnterOrEdit = 0
//defTotals = 1
//defBudget = 2
//defDirectDebit = 3
//
//m_iResultDateLow = 0
//m_iResultDateHigh = 999999
//m_fAllExpenses = 0.0
//m_fDDExpenses = 0.0
//m_fAllBudget = 0.0
//m_fDDBudget = 0.0
//m_fBudgetTotalYear = 0.0
//m_fBudgetTotalDD = 0.0
//m_fBudgetTargetDD = 0.0
//
//#
//# Class to deal with Recent Files
//#
//m_RecentFiles = RecentFiles(4,isWin,m_wRecentFiles)
//if sInitialFile == None:
//#    print 'Attempt to get Initial file..'
//    sInitialFile = m_RecentFiles.getNthRecent(1)
//
//   
//
//
//m_monthDays = [31,28,31,30,31,30,31,31,30,31,30,31]
//
//
//if sInitialFile == None:
//    sInitialFile = ''
//    
//m_wCategoryTree = createCategoryTree(sInitialFile)
//m_wResultsCategoryTree = createResultsCategoryTree(sInitialFile)
//
//
//if sInitialFile == None:
//    m_wRecordTree = buildRecordTree('')
//elif os.path.exists(sInitialFile):
//    m_wRecordTree = buildRecordTree(sInitialFile)
//else:
//    m_wRecordTree = buildRecordTree('')
//
//m_EditIter = m_wRecordTree.get_model().get_iter_root()
//
//
//
//# Build the results data structure.
//# It's a list containing the following fields
//# Combined categories, Accumulated Expenses, Budgeted Expenses, Difference
//# To work efficiently we need a Dictionary data structure that maps
//# the combined category strings to an index into the categories List.
//
//m_fDDBudget = 0.0
//m_fDDExpens = 0.0
//m_fFullBudget = 0.0
//m_fFullExpense = 0.0
//        
//m_iFirstRun = 1
//m_sResultsHeadings = [_('Category  '),('Total Expended  ')]
//m_sResultsHeadings.append(_('Budget for Period '))
//m_sResultsHeadings.append(_('Budget for Year '))
//m_sResultsHeadings.append(_('Direct Debit  '))
//m_sResultsHeadings.append(_('Difference '))
//
//
//m_wResultsTree = buildResultsTree()
//
//
//
//m_sRecordHeadings = [_('Category  '),_('Sub Category  ')]
//m_sRecordHeadings.append(_('Date '))
//m_sRecordHeadings.append(_('Amount '))
//m_sRecordHeadings.append(_('Comments '))
//
//m_sBudgetHeadings = [_('Category  '),_('Sub Category  ')]
//m_sBudgetHeadings.append(_('Yearly Budget '))
//m_sBudgetHeadings.append(_('Num Scheduled Payments '))
//m_sBudgetHeadings.append(_('Date First Payment '))
//m_sBudgetHeadings.append(_('Cash or Direct Debit '))
//
//m_wBudgetTree = buildBudgetTree()
//
//m_sBudDay = ""
//
//m_sDDDate = ''
//m_fDDSavings = 0.0
//m_sDDHeadings = [_('Category  '),_('Total Expended  ')]
//m_sDDHeadings.append(_('Budget to Date '))
//m_sDDHeadings.append(_('Next due Date '))
//m_sDDHeadings.append(_('Budget for Year '))
//m_sDDHeadings.append(_('Amount needed to be Saved '))
//
//m_wDDResultsTree = buildDDResultsTree()
//m_wDDWindow.add(m_wDDResultsTree)
//m_wDDWindow.show_all()
//
//
//
//
//
//def main():
//    global m_sBrowser
//    if not isWin:
//        global m_GConfClient
//        sWidth = m_GConfClient.get_string('/apps/myBudget/width')
//        sHeight = m_GConfClient.get_string('/apps/myBudget/height')
//#    m_sBrowser = m_GConfClient.get_string('/desktop/gnome/applications/browser/exec')
//#    print 'Browser is ',m_sBrowser
//    connectSignals()
//    if debugMsgs:
//        print('RP: Are we running on Windows?')
//        print(isWin)
//        
//    if isWin:
//        m_wMainWin.show_all()
//        (iWidth,iHeight) = m_wMainWin.get_size()
//        sWidth = "%d" % iWidth
//        sHeight = "%d" % iHeight
//        # Note to RP: Save Width to Registry Here
//    else:
//        if (sWidth == None) or (sHeight == None):
//            m_wMainWin.show_all()
//            (iWidth,iHeight) = m_wMainWin.get_size()
//            sWidth = "%d" % iWidth
//            sHeight = "%d" % iHeight
//            m_GConfClient.set_string('/apps/myBudget/width',sWidth)
//            m_GConfClient.set_string('/apps/myBudget/height',sHeight)
//        else:
//            iWidth = string.atoi(sWidth)
//            iHeight = string.atoi(sHeight)
//            m_wMainWin.resize(iWidth,iHeight)
//            m_wMainWin.show_all()
//    gtk.main()
