const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jvmdshsvbupwghfhpimk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp2bWRzaHN2YnVwd2doZmhwaW1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNDEzMTIsImV4cCI6MjA3NTcxNzMxMn0._klrbpnlkOanPlbJMt-wgY9tuQ4BrrAC8CW4PVOLR00';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    console.log('--- Reading News Schema ---');
    const { data: news, error: newsError } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(1);
    if (newsError) console.log('News Read Error:', newsError.message);
    else if (news.length > 0) console.log('News Keys:', Object.keys(news[0]));
    else console.log('No news found');

    console.log('--- Reading Cases Schema ---');
    const { data: cases, error: casesError } = await supabase.from('cases').select('*').order('created_at', { ascending: false }).limit(1);
    if (casesError) console.log('Cases Read Error:', casesError.message);
    else if (cases.length > 0) console.log('Cases Keys:', Object.keys(cases[0]));
    else console.log('No cases found');

    // Clean up
    if (news && news.length > 0) await supabase.from('news').delete().eq('id', news[0].id);
    if (cases && cases.length > 0) await supabase.from('cases').delete().eq('id', cases[0].id);
}

verify();
