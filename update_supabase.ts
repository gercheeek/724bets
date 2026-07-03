import { updateGlobalConfig, getGlobalConfig } from './utils/supabase';
import { DEFAULT_TV_CONFIG } from './constants';

async function run() {
  const current = await getGlobalConfig('site_tv_config');
  if (current) {
    console.log('Current config exists. Updating channels...');
    await updateGlobalConfig('site_tv_config', { ...current, channels: DEFAULT_TV_CONFIG.channels });
    console.log('Updated site_tv_config with new channels.');
  } else {
    console.log('No current config, inserting default...');
    await updateGlobalConfig('site_tv_config', DEFAULT_TV_CONFIG);
  }
}
run();
