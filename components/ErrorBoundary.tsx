import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type Props = { children: React.ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Sentryは検証のため一時的に無効化中。ここではログ出力のみ行う。
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>問題が発生しました</Text>
          <Text style={styles.message}>{String(this.state.error.message || this.state.error)}</Text>
          <Pressable style={styles.button} onPress={this.reset}>
            <Text style={styles.buttonLabel}>再試行</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  title: { fontSize: 16, fontWeight: '700' },
  message: { fontSize: 12, color: '#888', textAlign: 'center' },
  button: { marginTop: 12, paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#378ADD' },
  buttonLabel: { color: '#fff', fontWeight: '600' },
});