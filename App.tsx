import React, { useEffect, useState } from 'react';
import { I18nManager, SafeAreaView, Text, View, TouchableOpacity, TextInput, Image, FlatList, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchSources } from './src/api/indexJson';
import { makeProvider } from './src/providers/ProviderRegistry';
import type { SourceConfig, MangaTile } from './src/types';

function SourceItem({ item, onPress }:{ item: SourceConfig, onPress: ()=>void }){
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Text style={styles.title}>{item.name || item.baseUrl}</Text>
      <Text style={styles.sub}>{item.baseUrl}</Text>
    </TouchableOpacity>
  );
}

function Tile({ t, onPress }:{ t:MangaTile, onPress:()=>void }){
  return (
    <TouchableOpacity onPress={onPress} style={styles.tile}>
      {!!t.cover && <Image source={{uri:t.cover}} style={{width:72,height:96,borderRadius:8,backgroundColor:'#333'}} />}
      <View style={{flex:1, marginStart:8}}>
        <Text numberOfLines={2} style={styles.title}>{t.title}</Text>
        <Text numberOfLines={1} style={styles.sub}>{t.url}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function App(){
  const [route, setRoute] = useState<{name:string, params?:any}>({name:'home'});
  const [sources, setSources] = useState<SourceConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [q, setQ] = useState('');
  const [tiles, setTiles] = useState<MangaTile[]>([]);

  useEffect(()=>{
    try{ I18nManager.allowRTL(true); I18nManager.forceRTL(true);}catch{}
    (async()=>{
      setLoading(true); setError(null);
      try{ const list = await fetchSources(); setSources(list);}catch(e:any){ setError(e?.message||'خطأ');}
      setLoading(false);
    })();
  },[]);

  const openSource = async (s: SourceConfig) => {
    setRoute({name:'source', params:{s}});
    setLoading(true); setError(null);
    try{
      const prov = makeProvider(s);
      const l = await prov!.list(1);
      setTiles(l);
    }catch(e:any){
      setError(e?.message||'خطأ'); setTiles([]);
    }
    setLoading(false);
  };

  const doSearch = async () => {
    if(!route.params?.s) return;
    setLoading(true); setError(null);
    try{
      const prov = makeProvider(route.params.s);
      const l = await prov!.search(q, 1);
      setTiles(l);
    }catch(e:any){ setError(e?.message||'خطأ'); setTiles([]);}
    setLoading(false);
  };

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#111'}}>
      <StatusBar barStyle='light-content' />
      <View style={styles.topbar}>
        {route.name !== 'home' ? (
          <TouchableOpacity onPress={()=>setRoute({name:'home'})}><Text style={styles.back}>◀</Text></TouchableOpacity>
        ) : <View style={{width:24}}/>}
        <Text style={styles.topTitle}>{route.name==='home'?'Snow — المصادر': (route.params?.s?.name || 'المصدر')}</Text>
        <View style={{width:24}}/>
      </View>

      {route.name==='home' && (
        <View style={{flex:1, padding:12}}>
          {loading && <ActivityIndicator size='large' />}
          {error && <Text style={{color:'#f66'}}>{error}</Text>}
          <FlatList data={sources} keyExtractor={(x)=>x.id} renderItem={({item})=>(
            <SourceItem item={item} onPress={()=>openSource(item)} />
          )} />
        </View>
      )}

      {route.name==='source' && (
        <View style={{flex:1, padding:12}}>
          <View style={styles.searchRow}>
            <TextInput placeholder='ابحث...' placeholderTextColor='#aaa' style={styles.input} value={q} onChangeText={setQ} />
            <TouchableOpacity onPress={doSearch} style={styles.btn}><Text style={styles.btnTxt}>بحث</Text></TouchableOpacity>
          </View>
          {loading && <ActivityIndicator size='large' />}
          {error && <Text style={{color:'#f66'}}>{error}</Text>}
          <FlatList data={tiles} keyExtractor={(x)=>x.id} renderItem={({item})=>(
            <Tile t={item} onPress={()=>{ setRoute({name:'manga', params:{s:route.params.s, item}}) }} />
          )} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topbar:{height:52, backgroundColor:'#1b1b1b', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:8},
  back:{color:'#fff', fontSize:18, padding:6},
  topTitle:{color:'#fff', fontSize:18, fontWeight:'bold'},
  card:{backgroundColor:'#1c1c1c', borderRadius:10, padding:12, marginVertical:6},
  title:{color:'#fff', fontSize:16, fontWeight:'600'},
  sub:{color:'#aaa', fontSize:12},
  searchRow:{flexDirection:'row', gap:8, marginBottom:8},
  input:{flex:1, backgroundColor:'#1c1c1c', color:'#fff', borderRadius:8, paddingHorizontal:10, height:44},
  btn:{backgroundColor:'#2a6', borderRadius:8, alignItems:'center', justifyContent:'center', paddingHorizontal:14},
  btnTxt:{color:'#fff', fontWeight:'700'},
  tile:{flexDirection:'row', backgroundColor:'#1c1c1c', borderRadius:10, padding:8, marginVertical:6, alignItems:'center'}
});
